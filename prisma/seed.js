const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MMG database...');

  // 1. Clean existing records if any
  await prisma.comparisonItem.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.favourite.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.staffProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users (Super Admin, Staff, Sales, Customer)
  const passwordHashAdmin = await bcrypt.hash('Admin@MMG2026', 10);
  const passwordHashStaff = await bcrypt.hash('Staff@MMG2026', 10);
  const passwordHashSales = await bcrypt.hash('Sales@MMG2026', 10);
  const passwordHashCustomer = await bcrypt.hash('Customer@2026', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Rahul Borana',
      email: 'admin@mahadevmarble.com',
      phone: '+91 98290 11223',
      password: passwordHashAdmin,
      role: 'SUPER_ADMIN',
      staffProfile: {
        create: {
          role: 'SUPER_ADMIN',
          department: 'Executive Management',
          permissions: 'all',
        },
      },
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: 'Virendra Singh',
      email: 'staff@mahadevmarble.com',
      phone: '+91 98290 33445',
      password: passwordHashStaff,
      role: 'STAFF',
      staffProfile: {
        create: {
          role: 'STAFF',
          department: 'Inventory & Processing',
          permissions: 'products_edit,stock_update,photos_upload',
        },
      },
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      name: 'Manish Patidar',
      email: 'sales@mahadevmarble.com',
      phone: '+91 98290 55667',
      password: passwordHashSales,
      role: 'SALES_STAFF',
      staffProfile: {
        create: {
          role: 'SALES_STAFF',
          department: 'Sales & Quotations',
          permissions: 'enquiries_manage,quotations_create',
        },
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      password: passwordHashCustomer,
      role: 'CUSTOMER',
    },
  });

  // 3. Create Categories (Strictly Natural Stone - NO Ceramic Tiles)
  const marbleCategory = await prisma.category.create({
    data: {
      name: 'Marble',
      slug: 'marble',
      description: 'Finest Indian and imported natural marble slabs and custom cut tiles for luxury residential and commercial architecture.',
    },
  });

  const graniteCategory = await prisma.category.create({
    data: {
      name: 'Granite',
      slug: 'granite',
      description: 'High-density natural granite slabs and tiles, exceptionally durable for countertops, high-traffic flooring, and exterior cladding.',
    },
  });

  const stoneTilesCategory = await prisma.category.create({
    data: {
      name: 'Stone Tiles / Pieces',
      slug: 'stone-tiles',
      description: 'Precision-cut natural stone tiles, pavers, wall cladding pieces, and cut-to-size elements. 100% natural quarried stone.',
    },
  });

  // 4. Products Data (Realistic Indian pricing, codes, dimensions, specifications)
  const productsData = [
    {
      productCode: 'MMG-MAR-WHT-001',
      name: 'Makrana Pure White Marble',
      slug: 'makrana-pure-white-marble',
      material: 'Marble',
      categoryId: marbleCategory.id,
      format: 'SLAB',
      colour: 'White',
      pattern: 'Natural Veins',
      finish: 'Polished',
      description: 'Mined from the historic quarries of Makrana, Rajasthan. Renowned for its high calcium purity (over 98%), pure crystalline white luster, and resistance to water absorption. Each slab displays distinct fine natural grey veins that become more luminous over generations.',
      shortDescription: 'The quintessential Indian white marble of Taj Mahal legacy. Timeless crystalline finish with subtle grey veins.',
      pricePerSqft: 450,
      slabPrice: 27000,
      thicknessMm: 18,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 14,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: false,
      recommendedApplications: 'Living Room Flooring, Pooja Room, Master Bathroom, Wall Paneling',
      origin: 'Makrana, Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Makrana Pure White Marble slab view'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
          imageType: 'CLOSEUP',
          imageOrder: 1,
          isMain: false,
          altText: 'Makrana Pure White Marble crystalline veining detail'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'APPLICATION',
          imageOrder: 2,
          isMain: false,
          altText: 'Makrana White Marble flooring in premium Indian residence'
        }
      ]
    },
    {
      productCode: 'MMG-GRA-BLK-002',
      name: 'Black Galaxy Granite',
      slug: 'black-galaxy-granite',
      material: 'Granite',
      categoryId: graniteCategory.id,
      format: 'SLAB',
      colour: 'Black',
      pattern: 'Speckled',
      finish: 'Polished',
      description: 'Quarried exclusively in Chimakurthy near Ongole, Andhra Pradesh. This legendary dark granite features a pitch-black background speckled with bright golden bronzite crystals that sparkle under natural and ambient light. Highly resistant to staining and heat.',
      shortDescription: 'World-famous South Indian granite with golden-bronze crystal sparkles on jet black stone.',
      pricePerSqft: 220,
      slabPrice: 13200,
      thicknessMm: 20,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 28,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: false,
      recommendedApplications: 'Kitchen Countertops, Island Tops, Staircase Risers & Treads, Commercial Lobbies',
      origin: 'Chimakurthy, Andhra Pradesh, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Black Galaxy Granite polished slab'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1400&q=85',
          imageType: 'CLOSEUP',
          imageOrder: 1,
          isMain: false,
          altText: 'Black Galaxy golden flecks close-up'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
          imageType: 'APPLICATION',
          imageOrder: 2,
          isMain: false,
          altText: 'Black Galaxy Granite kitchen countertop installation'
        }
      ]
    },
    {
      productCode: 'MMG-MAR-WHT-003',
      name: 'Italian Statuario Extra Marble',
      slug: 'italian-statuario-extra-marble',
      material: 'Marble',
      categoryId: marbleCategory.id,
      format: 'SLAB',
      colour: 'White',
      pattern: 'Exotic',
      finish: 'Polished',
      description: 'Directly imported from the Carrara mountain range in Italy. Recognized by its brilliant milky white ground crossed by dramatic, bold slate-grey veins. Hand-selected block imported and precision gang-saw processed at our Kelwa facility.',
      shortDescription: 'The pinnacle of luxury white marble with bold dramatic bookmatched grey veining.',
      pricePerSqft: 950,
      slabPrice: 66500,
      thicknessMm: 18,
      lengthInches: 126,
      widthInches: 80,
      areaSqft: 70.0,
      quantity: 8,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: true,
      recommendedApplications: 'Bookmatched Feature Walls, Luxury Foyer, Master Bathroom Vanity',
      origin: 'Carrara, Italy',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Italian Statuario Marble bookmatch slab'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
          imageType: 'CLOSEUP',
          imageOrder: 1,
          isMain: false,
          altText: 'Italian Statuario dramatic grey veining detail'
        }
      ]
    },
    {
      productCode: 'MMG-GRA-BRN-004',
      name: 'Tan Brown Granite',
      slug: 'tan-brown-granite',
      material: 'Granite',
      categoryId: graniteCategory.id,
      format: 'SLAB',
      colour: 'Brown',
      pattern: 'Speckled',
      finish: 'Polished',
      description: 'Extracted from the Karimnagar district in Telangana. Rich chocolate brown base populated by burgundy and copper-tinted floral crystal inclusions. Exceptionally resilient stone with zero maintenance and excellent compressive strength.',
      shortDescription: 'Warm Indian copper-brown granite with dark chocolate and burgundy tones.',
      pricePerSqft: 145,
      slabPrice: 8700,
      thicknessMm: 20,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 35,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: false,
      recommendedApplications: 'Kitchen Platforms, Vanity Tops, Commercial Corridors, Exterior Steps',
      origin: 'Karimnagar, Telangana, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Tan Brown Granite slab surface'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
          imageType: 'CLOSEUP',
          imageOrder: 1,
          isMain: false,
          altText: 'Tan Brown Granite texture'
        }
      ]
    },
    {
      productCode: 'MMG-MAR-GRN-005',
      name: 'Bidasar Rainforest Green Marble',
      slug: 'bidasar-rainforest-green-marble',
      material: 'Marble',
      categoryId: marbleCategory.id,
      format: 'SLAB',
      colour: 'Green',
      pattern: 'Exotic',
      finish: 'Honed',
      description: 'A masterpiece from Bidasar, Churu district in Rajasthan. Often termed Rainforest Green or Mirage Green, this serpentine marble showcases an exotic web of dark moss-green, olive, and ochre entwined with rich tree-branch brown veins.',
      shortDescription: 'Exotic serpentine marble with dramatic tree-branch veins on a moss green canvas.',
      pricePerSqft: 280,
      slabPrice: 15400,
      thicknessMm: 18,
      lengthInches: 110,
      widthInches: 72,
      areaSqft: 55.0,
      quantity: 11,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: false,
      recommendedApplications: 'Accent Walls, Fireplace Surrounds, Dining Table Tops, Executive Offices',
      origin: 'Bidasar, Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Bidasar Rainforest Green Marble slab'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'APPLICATION',
          imageOrder: 1,
          isMain: false,
          altText: 'Bidasar Green feature wall installation'
        }
      ]
    },
    {
      productCode: 'MMG-MAR-WHT-006',
      name: 'Morwad White Marble',
      slug: 'morwad-white-marble',
      material: 'Marble',
      categoryId: marbleCategory.id,
      format: 'SLAB',
      colour: 'White',
      pattern: 'Natural Veins',
      finish: 'Polished',
      description: 'Quarried in Rajsamand, Rajasthan. Morwad white marble is one of the most durable and cost-effective Indian white marbles, noted for its fine milky white background accented by gentle wavy green and smoky grey mineral patterns.',
      shortDescription: 'High-strength Rajasthan white marble with delicate wavy green and grey waves.',
      pricePerSqft: 165,
      slabPrice: 9900,
      thicknessMm: 18,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 45,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: false,
      recommendedApplications: 'Extensive Bungalow Flooring, Balconies, Corridors, Apartment Complexes',
      origin: 'Morwad, Rajsamand, Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Morwad White Marble slab'
        }
      ]
    },
    {
      productCode: 'MMG-GRA-GRY-007',
      name: 'Steel Grey Granite',
      slug: 'steel-grey-granite',
      material: 'Granite',
      categoryId: graniteCategory.id,
      format: 'SLAB',
      colour: 'Grey',
      pattern: 'Speckled',
      finish: 'Leathered',
      description: 'Quarried in Ongole, Andhra Pradesh. Medium-variation natural granite featuring shades of dark and light steel grey with subtle silver intrusions. Shown here in our popular tactile Leathered finish which brings out a soft velvety texture.',
      shortDescription: 'Contemporary steel grey granite in tactile leathered and polished finishes.',
      pricePerSqft: 135,
      slabPrice: 8100,
      thicknessMm: 20,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 30,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: true,
      recommendedApplications: 'Modern Kitchen Counters, Bathroom Vanities, Outdoor Patio Counters',
      origin: 'Andhra Pradesh, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Steel Grey Granite slab surface'
        }
      ]
    },
    {
      productCode: 'MMG-MAR-BLK-008',
      name: 'Black Marquina Marble',
      slug: 'black-marquina-marble',
      material: 'Marble',
      categoryId: marbleCategory.id,
      format: 'SLAB',
      colour: 'Black',
      pattern: 'Linear',
      finish: 'Polished',
      description: 'Intense deep obsidian black natural marble with irregular, striking white calcite veins. Highly desired by interior architects for dramatic bathroom walls, custom furniture tops, and contrasting threshold borders.',
      shortDescription: 'Striking pitch-black marble accented with bold, irregular white calcite veining.',
      pricePerSqft: 340,
      slabPrice: 18700,
      thicknessMm: 18,
      lengthInches: 110,
      widthInches: 72,
      areaSqft: 55.0,
      quantity: 9,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: false,
      recommendedApplications: 'Feature Wall, Powder Room Vanity, Contrast Flooring Inlays',
      origin: 'Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Black Marquina Marble slab'
        }
      ]
    },
    {
      productCode: 'MMG-GRA-RED-009',
      name: 'Imperial Jhansi Red Granite',
      slug: 'imperial-jhansi-red-granite',
      material: 'Granite',
      categoryId: graniteCategory.id,
      format: 'SLAB',
      colour: 'Red',
      pattern: 'Speckled',
      finish: 'Polished',
      description: 'Quarried from the Jhansi and Lalitpur belt in Uttar Pradesh/Madhya Pradesh. Deep crimson red feldspar crystals interwoven with dark quartz specks. Among the hardest natural granites in India, completely impervious to weathering.',
      shortDescription: 'Rich royal red Indian granite of exceptional structural density and hardness.',
      pricePerSqft: 185,
      slabPrice: 11100,
      thicknessMm: 20,
      lengthInches: 120,
      widthInches: 72,
      areaSqft: 60.0,
      quantity: 18,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: false,
      recommendedApplications: 'Commercial Steps, Temple Architecture, Heavy Duty Flooring, Monuments',
      origin: 'Jhansi, Bundelkhand, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Imperial Jhansi Red Granite slab'
        }
      ]
    },
    {
      productCode: 'MMG-TIL-KOT-010',
      name: 'Kota Stone Natural Green Tiles',
      slug: 'kota-stone-natural-green-tiles',
      material: 'Natural Stone',
      categoryId: stoneTilesCategory.id,
      format: 'TILE',
      colour: 'Green',
      pattern: 'Plain',
      finish: 'Honed',
      description: '100% natural fine-grained limestone quarried at Kota, Rajasthan. Naturally cool underfoot in hot summers, non-slip, non-porous, and resistant to oil/chemical stains. Pre-cut and calibrated for seamless installation.',
      shortDescription: 'Authentic Kota limestone tiles. Naturally cool, rugged, and long-lasting for Indian climate.',
      pricePerSqft: 45,
      pricePerPiece: 180,
      thicknessMm: 22,
      lengthInches: 24,
      widthInches: 24,
      areaSqft: 4.0,
      quantity: 1200,
      availability: 'AVAILABLE',
      featured: true,
      isNewArrival: false,
      recommendedApplications: 'Verandahs, Parking Areas, Courtyards, School Corridors, Pathways',
      origin: 'Kota, Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Kota Stone tiles'
        }
      ]
    },
    {
      productCode: 'MMG-TIL-JAI-011',
      name: 'Jaisalmer Yellow Teakwood Sandstone Tiles',
      slug: 'jaisalmer-yellow-teakwood-sandstone-tiles',
      material: 'Natural Stone',
      categoryId: stoneTilesCategory.id,
      format: 'TILE',
      colour: 'Beige',
      pattern: 'Linear',
      finish: 'Honed',
      description: 'Quarried from the golden sands of Jaisalmer, Rajasthan. Warm mustard-yellow sandstone with distinct natural wood-grain banding. Beautifully suited for pool decks, exterior wall cladding, and heritage architecture.',
      shortDescription: 'Warm golden sandstone with natural organic teakwood grain patterns.',
      pricePerSqft: 95,
      pricePerPiece: 190,
      thicknessMm: 20,
      lengthInches: 24,
      widthInches: 12,
      areaSqft: 2.0,
      quantity: 850,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: true,
      recommendedApplications: 'Exterior Elevation, Pool Decks, Courtyard Feature Walls, Heritage Facades',
      origin: 'Jaisalmer, Rajasthan, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Jaisalmer Yellow Sandstone natural tiles'
        }
      ]
    },
    {
      productCode: 'MMG-TIL-GRA-012',
      name: 'Black Galaxy Cut-to-Size Granite Tiles',
      slug: 'black-galaxy-cut-to-size-granite-tiles',
      material: 'Granite',
      categoryId: stoneTilesCategory.id,
      format: 'TILE',
      colour: 'Black',
      pattern: 'Speckled',
      finish: 'Polished',
      description: 'Precision chamfered and calibrated natural granite tiles cut directly from first-choice Black Galaxy blocks. Perfectly square 24×24 inch tiles with mirror polish on face and calibrated back for rapid mortar bedding.',
      shortDescription: 'Calibrated 24×24 inch natural Black Galaxy tiles with sparkling golden specks.',
      pricePerSqft: 190,
      pricePerPiece: 760,
      thicknessMm: 16,
      lengthInches: 24,
      widthInches: 24,
      areaSqft: 4.0,
      quantity: 450,
      availability: 'AVAILABLE',
      featured: false,
      isNewArrival: false,
      recommendedApplications: 'Luxury Bathroom Flooring, Lift Lobbies, Apartment Balconies, Retail Showrooms',
      origin: 'Chimakurthy, Andhra Pradesh, India',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85',
          imageType: 'MAIN',
          imageOrder: 0,
          isMain: true,
          altText: 'Black Galaxy Granite cut tiles'
        }
      ]
    }
  ];

  for (const p of productsData) {
    const { images, ...productData } = p;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images,
        },
      },
    });
    console.log(`Created product: ${createdProduct.name} [${createdProduct.productCode}] (${createdProduct.format})`);
  }

  // 5. Create Sample Inquiries (to populate Admin CRM)
  const sampleProduct = await prisma.product.findUnique({
    where: { productCode: 'MMG-GRA-BLK-002' },
  });

  const enq1 = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-001',
      customerId: customerUser.id,
      productId: sampleProduct?.id,
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      quantity: '2 Slabs (Approx 120 sq.ft.)',
      approxAreaSqft: 120.0,
      message: 'Please share the latest price and availability for Black Galaxy Granite kitchen counter.',
      status: 'QUOTED',
      assignedStaff: 'Manish Patidar',
      staffNotes: 'Customer called. Requested 20mm thickness. Quotation MMG-QT-2026-001 sent on WhatsApp.',
    },
  });

  const sampleProduct2 = await prisma.product.findUnique({
    where: { productCode: 'MMG-MAR-WHT-001' },
  });

  await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-002',
      productId: sampleProduct2?.id,
      name: 'Ar. Ananya Verma',
      phone: '+91 98112 88990',
      whatsapp: '+91 98112 88990',
      email: 'ananya.architects@gmail.com',
      quantity: 'Approx 800 sq.ft.',
      approxAreaSqft: 800.0,
      message: 'Looking for premium Makrana White Marble slabs for a villa project in Gurgaon. Need bookmatch photos.',
      status: 'NEW',
      staffNotes: 'High-value architectural client. Needs high-res slab photos and dispatch timeline.',
    },
  });

  // 6. Create Sample Quotation for Enq 1
  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber: 'MMG-QT-2026-001',
      enquiryId: enq1.id,
      customerId: customerUser.id,
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rahul.sharma@example.com',
      customerAddress: 'Bungalow 14, Panchwati, Udaipur, Rajasthan',
      subtotal: 26400,
      discount: 1000,
      additionalCharges: 1500, // Freight & local delivery
      gstRate: 18.0,
      gstAmount: 4842,
      total: 31742,
      status: 'SENT',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: 'Rate includes safe wooden crated packing and loading at Udaipur yard. Transportation to site on client account.',
      termsAndConditions: '1. 50% advance along with confirmed order, balance prior to dispatch.\n2. Natural stone variation in shade and veins is inherent and acceptable.\n3. Goods once inspected and unloaded at site cannot be returned.\n4. Subject to Udaipur jurisdiction.',
      items: {
        create: [
          {
            productId: sampleProduct?.id,
            description: 'Black Galaxy Granite (Chimakurthy, AP) - 20mm Polished Slab',
            format: 'SLAB',
            quantitySqft: 120.0,
            ratePerSqft: 220.0,
            amount: 26400.0,
          },
        ],
      },
    },
  });

  console.log(`Created sample quotation: ${quotation.quotationNumber}`);
  console.log('Database seeded successfully with authentic Indian stone catalogue and CRM data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
