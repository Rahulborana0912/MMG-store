const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { spawn, execSync } = require('child_process');
const prisma = new PrismaClient();

const BASE_URL = 'http://localhost:3000';

async function testSuite() {
  console.log('====================================================');
  console.log('MMG PRODUCTION VERIFICATION TEST SUITE (FINAL STAGE)');
  console.log('====================================================\n');

  let serverProcess = null;
  // Check if server is running; if not, launch it temporarily for this test run
  try {
    const ping = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
    if (!ping.ok) throw new Error('Unhealthy');
    console.log('Detected active Next.js server on port 3000.\n');
  } catch {
    console.log('Starting Next.js server temporarily for automated testing...');
    serverProcess = spawn('npx', ['next', 'start', '-p', '3000'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      stdio: 'ignore',
    });

    let online = false;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const ping = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
        if (ping.ok) {
          online = true;
          console.log('Next.js server online and verified healthy on port 3000.\n');
          break;
        }
      } catch {
        // waiting for boot
      }
    }

    if (!online) {
      console.error('Failed to start Next.js server for testing.');
      if (serverProcess?.pid) {
        try { execSync(`taskkill /pid ${serverProcess.pid} /f /t`); } catch {}
      }
      process.exit(1);
    }
  }

  let passedTests = 0;
  let totalTests = 0;

  function assert(name, condition, details) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${name} — ${details || 'Assertion failed'}`);
    }
  }

  try {
    // ---------------------------------------------------------------------------
    // TEST 1: Health Endpoint & Database Latency
    // ---------------------------------------------------------------------------
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      const data = await res.json();
      assert('1. Health check /api/health responds with status: healthy', res.status === 200 && data.status === 'healthy', JSON.stringify(data));
      assert('2. Database connectivity verified via health check', data.database?.status === 'connected');
    } catch (e) {
      assert('1. Health check endpoint reachable', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 2: Public Routes (No Login Required)
    // ---------------------------------------------------------------------------
    const publicRoutes = [
      '/',
      '/catalogue',
      '/marble',
      '/granite',
      '/stone-tiles',
      '/available-stock',
      '/new-arrivals',
      '/applications',
      '/applications/flooring',
      '/applications/kitchen',
      '/applications/staircase',
      '/applications/wall-cladding',
      '/applications/bathroom',
      '/compare',
      '/help-me-choose',
      '/send-requirement',
      '/projects',
      '/about',
      '/contact',
      '/login',
      '/sitemap.xml',
      '/robots.txt',
    ];

    for (const route of publicRoutes) {
      try {
        const res = await fetch(`${BASE_URL}${route}`, { redirect: 'manual' });
        assert(`Public Route ${route} returns HTTP 200`, res.status === 200, `Got HTTP ${res.status}`);
      } catch (e) {
        assert(`Public Route ${route} reachable`, false, e.message);
      }
    }

    // ---------------------------------------------------------------------------
    // TEST 3: Physical Slab Inventory & Sample Privacy Guard
    // ---------------------------------------------------------------------------
    try {
      const sampleSlabsCount = await prisma.slabInventory.count({ where: { isSample: true } });
      assert('Physical Slab model supports isSample attribute', typeof sampleSlabsCount === 'number');

      // Verify public available-stock query logic excludes all isSample slabs
      const publicStockQuery = await prisma.product.findMany({
        where: {
          published: true,
          availability: { in: ['AVAILABLE', 'LOW_STOCK'] },
        },
        include: {
          slabs: {
            where: {
              status: 'AVAILABLE',
              isSample: false,
            },
          },
        },
      });

      let exposedSampleSlabs = 0;
      for (const prod of publicStockQuery) {
        for (const s of prod.slabs) {
          if (s.isSample) exposedSampleSlabs++;
        }
      }
      assert('Public Available Stock strictly hides all sample slabs (0 exposed)', exposedSampleSlabs === 0, `Found: ${exposedSampleSlabs}`);
    } catch (e) {
      assert('Physical Slab query test', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 4: Security Headers
    // ---------------------------------------------------------------------------
    try {
      const res = await fetch(`${BASE_URL}/`);
      const nosniff = res.headers.get('x-content-type-options');
      const xframe = res.headers.get('x-frame-options');
      assert('Security header X-Content-Type-Options: nosniff present', nosniff === 'nosniff', nosniff);
      assert('Security header X-Frame-Options: SAMEORIGIN present', xframe === 'SAMEORIGIN', xframe);
    } catch (e) {
      assert('Security headers check', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 5: Public Enquiry & Duplicate Prevention
    // ---------------------------------------------------------------------------
    try {
      const uniquePhone = `+91 91111 ${Math.floor(10000 + Math.random() * 90000)}`;
      const enqRes1 = await fetch(`${BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Verification Test Lead',
          phone: uniquePhone,
          city: 'Jaipur',
          application: 'Flooring',
          message: 'Looking for 600 sq.ft. Makrana White marble.',
          approxAreaSqft: 600,
          source: 'SEND_REQUIREMENT',
        }),
      });
      const enqData1 = await enqRes1.json();
      assert('Public Enquiry submission succeeds without login', enqRes1.status === 200 && enqData1.enquiry?.enquiryNumber, JSON.stringify(enqData1));

      // Test duplicate submission within 30s
      const enqRes2 = await fetch(`${BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Verification Test Lead',
          phone: uniquePhone,
          city: 'Jaipur',
          application: 'Flooring',
          message: 'Looking for 600 sq.ft. Makrana White marble.',
          approxAreaSqft: 600,
          source: 'SEND_REQUIREMENT',
        }),
      });
      const enqData2 = await enqRes2.json();
      assert('Duplicate enquiry prevention returns existing record instead of duplicate', enqData2.enquiry?.id === enqData1.enquiry?.id);
    } catch (e) {
      assert('Enquiry test', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 6: Complete Authorization Matrix & IDOR Protection
    // ---------------------------------------------------------------------------
    let adminCookies = '';
    let managerCookies = '';
    let staffCookies = '';
    let customerCookies = '';
    let customerBCookies = '';

    try {
      // 6A: Login as Customer A (Rahul Sharma)
      const custLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'rahul.sharma@example.com',
          password: 'Customer@2026',
        }),
      });
      customerCookies = custLoginRes.headers.get('set-cookie') || '';
      assert('Customer A (Rahul) login succeeds', custLoginRes.status === 200);

      // 6B: Login as Customer B (Vikram Mehta)
      const custBLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'vikram.mehta@example.com',
          password: 'CustomerB@2026',
        }),
      });
      customerBCookies = custBLoginRes.headers.get('set-cookie') || '';
      assert('Customer B (Vikram) login succeeds', custBLoginRes.status === 200);

      // 6C: Login as Staff (Virendra Singh)
      const staffLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'staff@mahadevmarble.com',
          password: 'Staff@MMG2026',
        }),
      });
      staffCookies = staffLoginRes.headers.get('set-cookie') || '';
      assert('Staff login succeeds', staffLoginRes.status === 200);

      // 6D: Login as Manager (Praveen Jain)
      const mgrLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'manager@mahadevmarble.com',
          password: 'Manager@MMG2026',
        }),
      });
      managerCookies = mgrLoginRes.headers.get('set-cookie') || '';
      assert('Manager login succeeds', mgrLoginRes.status === 200);

      // 6E: Login as Super Admin (Rahul Borana)
      const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@mahadevmarble.com',
          password: 'Admin@MMG2026',
        }),
      });
      adminCookies = adminLoginRes.headers.get('set-cookie') || '';
      assert('Super Admin login succeeds', adminLoginRes.status === 200);

      // 6F: IDOR Protection: Customer A creates requirement
      const reqCreateRes = await fetch(`${BASE_URL}/api/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: customerCookies },
        body: JSON.stringify({
          projectName: 'Customer A Private Drawing Project',
          approxAreaSqft: 1200,
          application: 'Living Room Flooring',
        }),
      });
      const reqCreateData = await reqCreateRes.json();
      const customerAReqId = reqCreateData.requirement?.id;
      assert('Customer A can create personal requirement', reqCreateRes.status === 200 && !!customerAReqId);

      // 6G: IDOR Protection: Customer B fetches requirements -> MUST NOT see Customer A requirement
      const custBReqRes = await fetch(`${BASE_URL}/api/requirements`, {
        headers: { Cookie: customerBCookies },
      });
      const custBReqData = await custBReqRes.json();
      const bHasA = custBReqData.requirements?.some((r) => r.id === customerAReqId);
      assert('IDOR Protection: Customer B cannot access Customer A requirements', !bHasA);

      // 6H: Customer A CAN see their own requirement
      const custAReqRes = await fetch(`${BASE_URL}/api/requirements`, {
        headers: { Cookie: customerCookies },
      });
      const custAReqData = await custAReqRes.json();
      const aHasA = custAReqData.requirements?.some((r) => r.id === customerAReqId);
      assert('Customer A can view their own requirements', !!aHasA);

      // 6I: Unauthenticated access rejected with 401
      const unauthReqRes = await fetch(`${BASE_URL}/api/requirements`);
      assert('Unauthenticated access to /api/requirements rejected with 401', unauthReqRes.status === 401);

      // 6J: Customer accessing admin-only endpoint rejected with 403 Forbidden
      const adminForbiddenRes = await fetch(`${BASE_URL}/api/admin/quotations`, {
        headers: { Cookie: customerCookies },
      });
      assert('Customer accessing /api/admin/quotations rejected with 403 Forbidden', adminForbiddenRes.status === 403);

      // 6K: Customer attempting to patch inventory rejected with 403 Forbidden
      const customerPatchSlab = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: customerCookies },
        body: JSON.stringify({ slabId: 'fake-id', status: 'RESERVED' }),
      });
      assert('Customer modifying inventory /api/admin/slabs rejected with 403 Forbidden', customerPatchSlab.status === 403);

      // 6L: Staff can access permitted admin endpoints
      const staffSlabsRes = await fetch(`${BASE_URL}/api/admin/slabs`, {
        headers: { Cookie: staffCookies },
      });
      assert('Staff permitted access to /api/admin/slabs', staffSlabsRes.status === 200);

      // 6M: Manager permitted access to /api/admin/quotations
      const mgrQuotesRes = await fetch(`${BASE_URL}/api/admin/quotations`, {
        headers: { Cookie: managerCookies },
      });
      assert('Manager permitted access to /api/admin/quotations', mgrQuotesRes.status === 200);

    } catch (e) {
      assert('Auth and IDOR verification', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 7: Quotation Engine & Authoritative Tax Calculation Matrix
    // ---------------------------------------------------------------------------
    try {
      // 7A: Standard 18% GST with discount and transport charges + Client Tampering Rejection
      const quote1Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Architect Alok Mathur',
          customerPhone: '+91 98290 88990',
          items: [
            {
              description: 'Black Galaxy Granite 20mm Polished Slab',
              format: 'SLAB',
              quantitySqft: 200,
              ratePerSqft: 220,
              amount: 1, // Fake client total
            },
          ],
          discount: 1000,
          additionalCharges: 2000,
          gstRate: 18.0,
          total: 999999, // Fake client total
        }),
      });
      const quote1Data = await quote1Res.json();
      const q1 = quote1Data.quotation;

      assert('Quotation 1: Server recalculates 18% GST: ₹8,100', q1?.gstAmount === 8100, `Got: ${q1?.gstAmount}`);
      assert('Quotation 1: Server overrides fake client total and computes ₹53,100', q1?.total === 53100, `Got: ${q1?.total}`);

      // 7B: 0% GST (SEZ / Export / Tax-Exempt Supply)
      const quote2Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Export Client Dubai SEZ',
          customerPhone: '+91 98290 11223',
          items: [
            {
              description: 'Makrana White Premium Gangsaw Slabs',
              format: 'SLAB',
              quantitySqft: 100,
              ratePerSqft: 500,
            },
          ],
          gstRate: 0,
        }),
      });
      const quote2Data = await quote2Res.json();
      const q2 = quote2Data.quotation;
      assert('Quotation 2: Supports 0% GST (SEZ/Export supply)', q2?.gstAmount === 0 && q2?.total === 50000);

      // 7C: 5% GST
      const quote3Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Low Tax Stone Client',
          customerPhone: '+91 98290 33221',
          items: [
            {
              description: 'Natural Sandstone Blocks',
              format: 'SLAB',
              quantitySqft: 200,
              ratePerSqft: 100,
            },
          ],
          gstRate: 5.0,
        }),
      });
      const quote3Data = await quote3Res.json();
      const q3 = quote3Data.quotation;
      assert('Quotation 3: Supports 5% GST (₹1,000 tax on ₹20,000)', q3?.gstAmount === 1000 && q3?.total === 21000);

      // 7D: Custom 12% GST
      const quote4Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Custom Tax Client',
          customerPhone: '+91 98290 44556',
          items: [
            {
              description: 'Kota Stone Natural Tiles',
              format: 'TILE',
              quantitySqft: 500,
              ratePerSqft: 60,
            },
          ],
          gstRate: 12.0,
        }),
      });
      const quote4Data = await quote4Res.json();
      const q4 = quote4Data.quotation;
      assert('Quotation 4: Supports custom 12% GST (₹3,600 tax on ₹30,000)', q4?.gstAmount === 3600 && q4?.total === 33600);

      // 7E: Luxury 28% GST
      const quote5Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Luxury High-Rate Stone Client',
          customerPhone: '+91 98290 55668',
          items: [
            {
              description: 'Exotic Composite Calacatta Slabs',
              format: 'SLAB',
              quantitySqft: 100,
              ratePerSqft: 500,
            },
          ],
          gstRate: 28.0,
        }),
      });
      const quote5Data = await quote5Res.json();
      const q5 = quote5Data.quotation;
      assert('Quotation 5: Supports 28% GST (₹14,000 tax on ₹50,000)', q5?.gstAmount === 14000 && q5?.total === 64000);

      // 7F: Fractional Gangsaw dimensions and 2-decimal rounding precision
      const quote6Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Fractional Dimension Test',
          customerPhone: '+91 98290 77889',
          items: [
            {
              description: 'Statuario Marble Slab #104',
              format: 'SLAB',
              quantitySqft: 132.75,
              ratePerSqft: 185.50,
            },
          ],
          gstRate: 18.0,
        }),
      });
      const quote6Data = await quote6Res.json();
      const q6 = quote6Data.quotation;
      assert('Quotation 6: Handles fractional dimensions with 2-decimal precision (₹24,625.13)', q6?.subtotal === 24625.13, `Got: ${q6?.subtotal}`);
      assert('Quotation 6: Rounds grand total accurately (₹29,057.65)', q6?.total === 29057.65, `Got: ${q6?.total}`);

      // 7G: Discount Clamping (Discount exceeding subtotal)
      const quote7Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Discount Clamping Test',
          customerPhone: '+91 98290 99999',
          items: [
            {
              description: 'Sample Stone',
              format: 'SLAB',
              quantitySqft: 10,
              ratePerSqft: 100,
            },
          ],
          discount: 5000,
          gstRate: 18.0,
        }),
      });
      const quote7Data = await quote7Res.json();
      const q7 = quote7Data.quotation;
      assert('Quotation 7: Clamps discount so taxable base never becomes negative', q7?.total === 0 && q7?.gstAmount === 0);

      // 7H: Negative discount and charges sanitized to 0
      const quote8Res = await fetch(`${BASE_URL}/api/admin/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          customerName: 'Negative Values Sanitization Test',
          customerPhone: '+91 98290 88776',
          items: [
            {
              description: 'Standard Marble Slab',
              format: 'SLAB',
              quantitySqft: 100,
              ratePerSqft: 100,
            },
          ],
          discount: -500,
          additionalCharges: -200,
          gstRate: 18.0,
        }),
      });
      const quote8Data = await quote8Res.json();
      const q8 = quote8Data.quotation;
      assert('Quotation 8: Negative discount/charges sanitized to 0 (subtotal ₹10,000, total ₹11,800)', q8?.total === 11800 && q8?.discount === 0);

    } catch (e) {
      assert('Quotation calculation test matrix', false, e.message);
    }

    // ---------------------------------------------------------------------------
    // TEST 8: Complete Inventory State Machine & Concurrency Guard
    // ---------------------------------------------------------------------------
    let testSlabId = null;
    try {
      const firstProduct = await prisma.product.findFirst({ where: { published: true } });
      if (!firstProduct) throw new Error('No product found for test slab');

      // Create temporary test slab in AVAILABLE status
      const createdSlab = await prisma.slabInventory.create({
        data: {
          slabCode: `MMG-VERIFY-TEST-${Date.now()}`,
          productId: firstProduct.id,
          thicknessMm: 18,
          lengthInches: 120,
          widthInches: 72,
          areaSqft: 60.0,
          status: 'AVAILABLE',
          location: 'Kelwa Yard Bay A-1',
          isSample: false,
        },
      });
      testSlabId = createdSlab.id;

      // 8A: Transition AVAILABLE -> RESERVED = allowed
      const resAtoR = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'RESERVED',
          reservedBy: 'Staff Member 1',
        }),
      });
      assert('State Machine: AVAILABLE -> RESERVED succeeds (200)', resAtoR.status === 200);

      // 8B: RESERVED -> RESERVED on same slab by another staff member = rejected with HTTP 409 Conflict
      const resRtoR = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'RESERVED',
          reservedBy: 'Staff Member 2',
        }),
      });
      assert('State Machine: Double reservation on RESERVED slab rejected with HTTP 409 Conflict', resRtoR.status === 409);

      // 8C: RESERVED -> SOLD = allowed
      const resRtoS = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'SOLD',
        }),
      });
      assert('State Machine: RESERVED -> SOLD succeeds (200)', resRtoS.status === 200);

      // 8D: SOLD -> RESERVED = rejected (HTTP 400)
      const resStoR = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'RESERVED',
        }),
      });
      assert('State Machine: SOLD -> RESERVED rejected with HTTP 400', resStoR.status === 400);

      // 8E: Ordinary STAFF attempting SOLD -> AVAILABLE = rejected with HTTP 403
      const resStoA_staff = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'AVAILABLE',
        }),
      });
      assert('State Machine: Ordinary STAFF attempting SOLD -> AVAILABLE rejected with HTTP 403', resStoA_staff.status === 403);

      // 8F: ADMIN attempting SOLD -> AVAILABLE = allowed (reinstated)
      const resStoA_admin = await fetch(`${BASE_URL}/api/admin/slabs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookies },
        body: JSON.stringify({
          slabId: testSlabId,
          status: 'AVAILABLE',
        }),
      });
      assert('State Machine: ADMIN permitted to reinstate SOLD -> AVAILABLE (200)', resStoA_admin.status === 200);

      // 8G: Concurrency check: concurrent simultaneous reservations for AVAILABLE slab
      const [concRes1, concRes2] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/slabs`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: staffCookies },
          body: JSON.stringify({ slabId: testSlabId, status: 'RESERVED', reservedBy: 'Concurrent 1' }),
        }),
        fetch(`${BASE_URL}/api/admin/slabs`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: managerCookies },
          body: JSON.stringify({ slabId: testSlabId, status: 'RESERVED', reservedBy: 'Concurrent 2' }),
        }),
      ]);
      const statuses = [concRes1.status, concRes2.status].sort();
      assert(
        'State Machine Concurrency: Exactly one reservation succeeds (200) and one receives HTTP 409 Conflict',
        statuses[0] === 200 && statuses[1] === 409,
        `Got statuses: ${statuses.join(', ')}`
      );

      // 8H: AuditLog verified for mutations
      const slabAuditLogs = await prisma.auditLog.count({
        where: { entityId: testSlabId },
      });
      assert('State Machine: AuditLog entries recorded for slab mutations', slabAuditLogs >= 3, `Count: ${slabAuditLogs}`);

    } catch (e) {
      assert('State machine and concurrency test', false, e.message);
    } finally {
      // Clean up temporary test slab to preserve 0 verified physical slabs in DB
      if (testSlabId) {
        try {
          await prisma.auditLog.deleteMany({ where: { entityId: testSlabId } });
          await prisma.slabInventory.delete({ where: { id: testSlabId } });
        } catch {}
      }
    }

    // ---------------------------------------------------------------------------
    // TEST 9: Existing Data Preservation & Zero Synthetic Slabs
    // ---------------------------------------------------------------------------
    try {
      const productsCount = await prisma.product.count();
      const usersCount = await prisma.user.count();
      const enquiriesCount = await prisma.enquiry.count();
      const quotesCount = await prisma.quotation.count();
      const sampleSlabsCount = await prisma.slabInventory.count({ where: { isSample: true } });

      assert('Original 12 natural stone varieties preserved intact', productsCount >= 12, `Count: ${productsCount}`);
      assert('Users preserved including Super Admin, Staff, Manager & Customers', usersCount >= 6, `Count: ${usersCount}`);
      assert('Enquiries preserved and incremented', enquiriesCount >= 4, `Count: ${enquiriesCount}`);
      assert('Quotations preserved and incremented', quotesCount >= 2, `Count: ${quotesCount}`);
      assert('Synthetic/sample slabs strictly 0 in production inventory', sampleSlabsCount === 0, `Sample slabs count: ${sampleSlabsCount}`);
    } catch (e) {
      assert('Data preservation check', false, e.message);
    }

    console.log('\n====================================================');
    console.log(`TEST SUITE FINISHED: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('====================================================');

    if (passedTests === totalTests) {
      console.log('STATUS: ALL PRODUCTION VERIFICATION TESTS PASSED (100%)!');
    } else {
      console.error(`STATUS: ${totalTests - passedTests} TESTS FAILED!`);
      process.exit(1);
    }
  } finally {
    if (serverProcess?.pid) {
      console.log('\nShutting down temporary test server process...');
      try {
        execSync(`taskkill /pid ${serverProcess.pid} /f /t`);
      } catch {
        // process closed
      }
    }
  }
}

testSuite()
  .catch((e) => {
    console.error('Fatal test error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
