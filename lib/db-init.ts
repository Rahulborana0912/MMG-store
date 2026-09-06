import prisma from './prisma';
import bcrypt from 'bcryptjs';

let isInitialized = false;

/**
 * Ensures the database contains initial stone catalogue, admin users, and categories.
 * Runs once safely upon initial API request if database is fresh or empty.
 */
export async function ensureDatabaseReady() {
  if (isInitialized) return;

  try {
    const productCount = await prisma.product.count();
    if (productCount > 0) {
      isInitialized = true;
      return;
    }

    console.log('Database empty. Auto-initializing MMG catalogue and accounts...');

    // 1. Create Default Users
    const adminPass = await bcrypt.hash('Admin@MMG2026', 10);
    const staffPass = await bcrypt.hash('Staff@MMG2026', 10);
    const salesPass = await bcrypt.hash('Sales@MMG2026', 10);
    const custPass = await bcrypt.hash('Customer@2026', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@mahadevmarble.com' },
      update: {},
      create: {
        name: 'Rahul Borana',
        email: 'admin@mahadevmarble.com',
        phone: '+91 98290 11223',
        password: adminPass,
        role: 'ADMIN',
        staffProfile: {
          create: {
            role: 'ADMIN',
            department: 'Executive Management',
            permissions: 'all',
          },
        },
      },
    });

    await prisma.user.upsert({
      where: { email: 'sales@mahadevmarble.com' },
      update: {},
      create: {
        name: 'Manish Patidar',
        email: 'sales@mahadevmarble.com',
        phone: '+91 98290 55667',
        password: salesPass,
        role: 'STAFF',
        staffProfile: {
          create: {
            role: 'STAFF',
            department: 'Sales & Quotations',
            permissions: 'enquiries_manage,quotations_create',
          },
        },
      },
    });

    await prisma.user.upsert({
      where: { email: 'staff@mahadevmarble.com' },
      update: {},
      create: {
        name: 'Virendra Singh',
        email: 'staff@mahadevmarble.com',
        phone: '+91 98290 33445',
        password: staffPass,
        role: 'STAFF',
        staffProfile: {
          create: {
            role: 'STAFF',
            department: 'Inventory & Stockyard',
            permissions: 'products_edit,stock_update',
          },
        },
      },
    });

    const customer = await prisma.user.upsert({
      where: { email: 'rahul.sharma@example.com' },
      update: {},
      create: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        password: custPass,
        role: 'CUSTOMER',
      },
    });

    // 2. Categories
    const marbleCat = await prisma.category.upsert({
      where: { slug: 'marble' },
      update: {},
      create: {
        name: 'Marble',
        slug: 'marble',
        description: 'Finest Indian and imported natural marble slabs and custom cut tiles.',
      },
    });

    const graniteCat = await prisma.category.upsert({
      where: { slug: 'granite' },
      update: {},
      create: {
        name: 'Granite',
        slug: 'granite',
        description: 'High-density natural granite slabs and tiles, exceptionally durable.',
      },
    });

    const stoneTilesCat = await prisma.category.upsert({
      where: { slug: 'stone-tiles' },
      update: {},
      create: {
        name: 'Stone Tiles / Pieces',
        slug: 'stone-tiles',
        description: '100% natural quarried stone tiles and cut-to-size elements. No ceramic.',
      },
    });

    // 3. Products
    const productsToSeed = [
      {
        productCode: 'MMG-MAR-WHT-001',
        name: 'Makrana Pure White Marble',
        slug: 'makrana-pure-white-marble',
        material: 'Marble',
        categoryId: marbleCat.id,
        format: 'SLAB' as const,
        colour: 'White',
        pattern: 'Natural Veins',
        finish: 'Polished',
        description: 'Mined from the historic quarries of Makrana, Rajasthan. Renowned for its high calcium purity (over 98%), pure crystalline white luster, and resistance to water absorption.',
        shortDescription: 'The quintessential Indian white marble of Taj Mahal legacy. Timeless crystalline finish.',
        pricePerSqft: 450,
        slabPrice: 27000,
        thicknessMm: 18,
        lengthInches: 120,
        widthInches: 72,
        areaSqft: 60.0,
        quantity: 14,
        availability: 'AVAILABLE' as const,
        featured: true,
        origin: 'Makrana, Rajasthan, India',
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
            imageType: 'MAIN',
            imageOrder: 0,
            isMain: true,
          },
        ],
      },
      {
        productCode: 'MMG-GRA-BLK-002',
        name: 'Black Galaxy Granite',
        slug: 'black-galaxy-granite',
        material: 'Granite',
        categoryId: graniteCat.id,
        format: 'SLAB' as const,
        colour: 'Black',
        pattern: 'Speckled',
        finish: 'Polished',
        description: 'Quarried in Chimakurthy near Ongole, Andhra Pradesh. Pitch-black background speckled with bright golden bronzite crystals that sparkle under natural light.',
        shortDescription: 'World-famous South Indian granite with golden-bronze crystal sparkles on jet black stone.',
        pricePerSqft: 220,
        slabPrice: 13200,
        thicknessMm: 20,
        lengthInches: 120,
        widthInches: 72,
        areaSqft: 60.0,
        quantity: 28,
        availability: 'AVAILABLE' as const,
        featured: true,
        origin: 'Chimakurthy, Andhra Pradesh, India',
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
            imageType: 'MAIN',
            imageOrder: 0,
            isMain: true,
          },
        ],
      },
      {
        productCode: 'MMG-MAR-WHT-003',
        name: 'Italian Statuario Extra Marble',
        slug: 'italian-statuario-extra-marble',
        material: 'Marble',
        categoryId: marbleCat.id,
        format: 'SLAB' as const,
        colour: 'White',
        pattern: 'Exotic',
        finish: 'Polished',
        description: 'Directly imported from the Carrara mountain range in Italy. Recognized by its brilliant milky white ground crossed by dramatic, bold slate-grey veins.',
        shortDescription: 'The pinnacle of luxury white marble with bold dramatic bookmatched grey veining.',
        pricePerSqft: 950,
        slabPrice: 66500,
        thicknessMm: 18,
        lengthInches: 126,
        widthInches: 80,
        areaSqft: 70.0,
        quantity: 8,
        availability: 'AVAILABLE' as const,
        featured: true,
        origin: 'Carrara, Italy',
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
            imageType: 'MAIN',
            imageOrder: 0,
            isMain: true,
          },
        ],
      },
      {
        productCode: 'MMG-GRA-BRN-004',
        name: 'Tan Brown Granite',
        slug: 'tan-brown-granite',
        material: 'Granite',
        categoryId: graniteCat.id,
        format: 'SLAB' as const,
        colour: 'Brown',
        pattern: 'Speckled',
        finish: 'Polished',
        description: 'Extracted from the Karimnagar district in Telangana. Rich chocolate brown base populated by burgundy and copper-tinted floral crystal inclusions.',
        shortDescription: 'Warm Indian copper-brown granite with dark chocolate and burgundy tones.',
        pricePerSqft: 145,
        slabPrice: 8700,
        thicknessMm: 20,
        lengthInches: 120,
        widthInches: 72,
        areaSqft: 60.0,
        quantity: 35,
        availability: 'AVAILABLE' as const,
        featured: false,
        origin: 'Karimnagar, Telangana, India',
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1400&q=85',
            imageType: 'MAIN',
            imageOrder: 0,
            isMain: true,
          },
        ],
      },
      {
        productCode: 'MMG-TIL-KOT-010',
        name: 'Kota Stone Natural Green Tiles',
        slug: 'kota-stone-natural-green-tiles',
        material: 'Natural Stone',
        categoryId: stoneTilesCat.id,
        format: 'TILE' as const,
        colour: 'Green',
        pattern: 'Plain',
        finish: 'Honed',
        description: '100% natural fine-grained limestone quarried at Kota, Rajasthan. Naturally cool underfoot in hot summers, non-slip, and non-porous.',
        shortDescription: 'Authentic Kota limestone tiles. Naturally cool, rugged, and long-lasting for Indian climate.',
        pricePerSqft: 45,
        pricePerPiece: 180,
        thicknessMm: 22,
        lengthInches: 24,
        widthInches: 24,
        areaSqft: 4.0,
        quantity: 1200,
        availability: 'AVAILABLE' as const,
        featured: true,
        origin: 'Kota, Rajasthan, India',
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85',
            imageType: 'MAIN',
            imageOrder: 0,
            isMain: true,
          },
        ],
      },
    ];

    for (const p of productsToSeed) {
      const { images, ...productData } = p;
      await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images,
          },
        },
      });
    }

    // Sample Enquiry & Quote
    const sampleProduct = await prisma.product.findUnique({
      where: { productCode: 'MMG-GRA-BLK-002' },
    });

    const enq = await prisma.enquiry.create({
      data: {
        enquiryNumber: 'ENQ-2026-001',
        customerId: customer.id,
        productId: sampleProduct?.id,
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        quantity: '2 Slabs (120 sq.ft.)',
        approxAreaSqft: 120.0,
        message: 'Need 20mm polished Black Galaxy Granite for kitchen platform.',
        status: 'QUOTED',
        assignedStaff: 'Manish Patidar',
        staffNotes: 'Quotation MMG-QT-2026-001 shared with customer.',
      },
    });

    await prisma.quotation.create({
      data: {
        quotationNumber: 'MMG-QT-2026-001',
        enquiryId: enq.id,
        customerId: customer.id,
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        customerEmail: 'rahul.sharma@example.com',
        customerAddress: 'Bungalow 14, Udaipur, Rajasthan',
        subtotal: 26400,
        discount: 1000,
        additionalCharges: 1500,
        gstRate: 18.0,
        gstAmount: 4842,
        total: 31742,
        status: 'SENT',
        notes: 'Rate includes wooden crated packing and crane loading at Raghunathpura, Kelwa yard.',
        termsAndConditions: '1. 50% advance along with order.\n2. Natural stone variation is inherent.\n3. Subject to Rajsamand/Udaipur jurisdiction.',
        items: {
          create: [
            {
              productId: sampleProduct?.id,
              description: 'Black Galaxy Granite - 20mm Polished Slab',
              format: 'SLAB',
              quantitySqft: 120.0,
              ratePerSqft: 220.0,
              amount: 26400.0,
            },
          ],
        },
      },
    });

    console.log('Database auto-initialization completed successfully.');
    isInitialized = true;
  } catch (error) {
    console.error('Error during database check/init:', error);
  }
}
