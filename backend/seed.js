const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User     = require('./src/models/user.model');
const Category = require('./src/models/category.model');
const Product  = require('./src/models/product.model');
const Order    = require('./src/models/order.model');

const categories = [
  { name: 'Handbags',    description: 'Elegant handbags for every occasion', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
  { name: 'Trolleys',    description: 'Premium travel trolleys and luggage sets', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { name: 'Shoes',       description: 'Stylish shoes for men and women', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Wallets',     description: 'Genuine leather wallets and cardholders', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
  { name: 'Backpacks',   description: 'Casual and business backpacks', image: 'https://images.unsplash.com/photo-1622560480605-d83c661175df?w=400' },
  { name: 'Accessories', description: 'Belts, keychains, and travel accessories', image: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?w=400' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  const cats = await Category.insertMany(categories);
  const c = {};
  cats.forEach(x => c[x.name] = x._id);

  const adminPass = await bcrypt.hash('admin123', 12);
  const custPass  = await bcrypt.hash('customer123', 12);
  const users = await User.insertMany([
    { name: 'Admin El-Za3eem', email: 'admin@elza3eem.com', password: adminPass, role: 'admin' },
    { name: 'Sara Ahmed',      email: 'sara@example.com',   password: custPass,  role: 'customer' },
    { name: 'Mohamed Ali',     email: 'mo@example.com',     password: custPass,  role: 'customer' },
    { name: 'Nour Hassan',     email: 'nour@example.com',   password: custPass,  role: 'customer' },
  ]);

  const products = [
    { name: 'El-Za3eem Classic Tote',        price: 850,  discountPrice: 699,  category: c['Handbags'],    stock: 40,  sold: 120, isFeatured: true,  brand: 'El-Za3eem', rating: 4.8, numReviews: 94,  images: [{ url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', alt: 'Classic Tote' }], description: 'Handcrafted genuine leather tote with gold accents. Spacious interior with multiple compartments. Perfect for daily use and business meetings.', tags: ['tote', 'leather', 'handbag', 'gold'] },
    { name: 'El-Za3eem Crossbody Bag',       price: 599,  discountPrice: 499,  category: c['Handbags'],    stock: 55,  sold: 89,  isFeatured: true,  brand: 'El-Za3eem', rating: 4.7, numReviews: 67,  images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', alt: 'Crossbody Bag' }], description: 'Compact and stylish crossbody bag in premium suede. Adjustable strap, magnetic closure, and inner zip pocket. Available in camel, black, and burgundy.', tags: ['crossbody', 'suede', 'compact'] },
    { name: 'El-Za3eem Evening Clutch',      price: 450,  discountPrice: 0,    category: c['Handbags'],    stock: 30,  sold: 45,  isFeatured: false, brand: 'El-Za3eem', rating: 4.6, numReviews: 38,  images: [{ url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600', alt: 'Evening Clutch' }], description: 'Luxurious evening clutch with metallic finish and crystal embellishments. Chain strap included. Ideal for weddings and formal events.', tags: ['clutch', 'evening', 'formal', 'crystal'] },
    { name: 'El-Za3eem Shoulder Bag',        price: 720,  discountPrice: 620,  category: c['Handbags'],    stock: 35,  sold: 77,  isFeatured: false, brand: 'El-Za3eem', rating: 4.5, numReviews: 52,  images: [{ url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', alt: 'Shoulder Bag' }], description: 'Structured shoulder bag in full-grain leather. Wide padded strap, brass hardware, and suede lining. A timeless El-Za3eem signature piece.', tags: ['shoulder', 'leather', 'structured'] },

    { name: 'El-Za3eem Explorer 28"',        price: 2200, discountPrice: 1899, category: c['Trolleys'],    stock: 25,  sold: 55,  isFeatured: true,  brand: 'El-Za3eem', rating: 4.9, numReviews: 48,  images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', alt: 'Explorer Trolley' }], description: '28-inch hardshell trolley with 360° spinner wheels, TSA-approved lock, and expandable capacity. Lightweight polycarbonate shell in 6 colors.', tags: ['trolley', 'hardshell', 'travel', 'large'] },
    { name: 'El-Za3eem Voyager 24"',         price: 1800, discountPrice: 1499, category: c['Trolleys'],    stock: 30,  sold: 42,  isFeatured: true,  brand: 'El-Za3eem', rating: 4.8, numReviews: 36,  images: [{ url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600', alt: 'Voyager Trolley' }], description: 'Medium 24-inch trolley perfect for weekend trips. Dual-zip main compartment, front pocket organizer, and silent spinner wheels.', tags: ['trolley', 'medium', 'travel', 'hardshell'] },
    { name: 'El-Za3eem Cabin 20"',           price: 1400, discountPrice: 1199, category: c['Trolleys'],    stock: 40,  sold: 68,  isFeatured: false, brand: 'El-Za3eem', rating: 4.7, numReviews: 61,  images: [{ url: 'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=600', alt: 'Cabin Trolley' }], description: 'Cabin-approved 20-inch carry-on. Fits in overhead compartments on all major airlines. Quick-access front pocket and retractable handle system.', tags: ['cabin', 'carry-on', 'compact', 'travel'] },
    { name: 'El-Za3eem 3-Piece Set',         price: 4500, discountPrice: 3799, category: c['Trolleys'],    stock: 15,  sold: 28,  isFeatured: true,  brand: 'El-Za3eem', rating: 4.9, numReviews: 29,  images: [{ url: 'https://images.unsplash.com/photo-1596460107916-430662021049?w=600', alt: 'Luggage Set' }], description: 'Complete matching set: 20", 24", and 28" trolleys in premium polycarbonate. Matching zipper pulls and TSA locks on all pieces. The ultimate travel collection.', tags: ['set', 'luggage', 'matching', 'complete'] },

    { name: 'El-Za3eem Oxford Lace-Up',      price: 1200, discountPrice: 999,  category: c['Shoes'],       stock: 60,  sold: 145, isFeatured: true,  brand: 'El-Za3eem', rating: 4.8, numReviews: 112, images: [{ url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', alt: 'Oxford Shoes' }], description: 'Full-grain leather Oxford shoes with Goodyear welt construction. Cushioned insole and rubber outsole. Available in black and cognac in sizes 39–46.', tags: ['oxford', 'leather', 'formal', 'mens'] },
    { name: 'El-Za3eem Slip-On Loafer',      price: 950,  discountPrice: 799,  category: c['Shoes'],       stock: 70,  sold: 198, isFeatured: true,  brand: 'El-Za3eem', rating: 4.7, numReviews: 156, images: [{ url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600', alt: 'Loafer' }], description: 'Premium suede loafer with memory foam insole. Metal bit detail, leather lining, and flexible sole. Smart-casual style for every occasion.', tags: ['loafer', 'suede', 'slip-on', 'casual'] },
    { name: 'El-Za3eem Stiletto Heels',      price: 1100, discountPrice: 899,  category: c['Shoes'],       stock: 45,  sold: 87,  isFeatured: false, brand: 'El-Za3eem', rating: 4.6, numReviews: 73,  images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', alt: 'Stiletto Heels' }], description: 'Elegant pointed-toe stiletto in genuine leather. 9cm heel height, cushioned footbed, and non-slip sole. Available in nude, black, and red.', tags: ['heels', 'stiletto', 'formal', 'womens'] },
    { name: 'El-Za3eem Ankle Boot',          price: 1350, discountPrice: 1149, category: c['Shoes'],       stock: 50,  sold: 102, isFeatured: true,  brand: 'El-Za3eem', rating: 4.8, numReviews: 88,  images: [{ url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600', alt: 'Ankle Boot' }], description: 'Genuine leather ankle boot with side zip and stacked heel. Padded collar, leather lining, and durable rubber sole. Sizes 36–42.', tags: ['boot', 'ankle', 'leather', 'womens'] },

    { name: 'El-Za3eem Bifold Wallet',       price: 280,  discountPrice: 229,  category: c['Wallets'],     stock: 100, sold: 320, isFeatured: true,  brand: 'El-Za3eem', rating: 4.9, numReviews: 284, images: [{ url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600', alt: 'Bifold Wallet' }], description: 'Slim genuine leather bifold wallet with RFID blocking. 6 card slots, 2 bill compartments, and photo ID window. Classic El-Za3eem interior branding.', tags: ['wallet', 'leather', 'rfid', 'slim'] },
    { name: 'El-Za3eem Card Holder',         price: 150,  discountPrice: 0,    category: c['Wallets'],     stock: 120, sold: 210, isFeatured: false, brand: 'El-Za3eem', rating: 4.7, numReviews: 177, images: [{ url: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600', alt: 'Card Holder' }], description: 'Ultra-slim card holder in full-grain leather. Holds up to 8 cards with RFID protection. A minimalist essential for the modern professional.', tags: ['cardholder', 'slim', 'rfid', 'minimalist'] },

    { name: 'El-Za3eem City Backpack',       price: 980,  discountPrice: 849,  category: c['Backpacks'],   stock: 45,  sold: 134, isFeatured: true,  brand: 'El-Za3eem', rating: 4.8, numReviews: 118, images: [{ url: 'https://images.unsplash.com/photo-1622560480605-d83c661175df?w=600', alt: 'City Backpack' }], description: '20L city backpack in premium canvas with leather trim. Padded 15" laptop compartment, water bottle pocket, and hidden back pocket. Commuter perfection.', tags: ['backpack', 'laptop', 'canvas', 'city'] },
    { name: 'El-Za3eem Travel Backpack',     price: 1200, discountPrice: 999,  category: c['Backpacks'],   stock: 35,  sold: 78,  isFeatured: false, brand: 'El-Za3eem', rating: 4.7, numReviews: 65,  images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', alt: 'Travel Backpack' }], description: '35L travel backpack with airline carry-on compliance. Clamshell opening, hip belt, and adjustable harness system. Perfect for weekend adventures.', tags: ['backpack', 'travel', '35L', 'hiking'] },

    { name: 'El-Za3eem Leather Belt',        price: 320,  discountPrice: 269,  category: c['Accessories'], stock: 80,  sold: 245, isFeatured: false, brand: 'El-Za3eem', rating: 4.7, numReviews: 198, images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4b05?w=600', alt: 'Leather Belt' }], description: 'Full-grain leather belt with brushed gold buckle. 3.5cm width, available in black and tan, sizes 75–115cm. Beautifully packaged — ideal as a gift.', tags: ['belt', 'leather', 'gold', 'accessory'] },
    { name: 'El-Za3eem Passport Holder',     price: 180,  discountPrice: 149,  category: c['Accessories'], stock: 90,  sold: 167, isFeatured: false, brand: 'El-Za3eem', rating: 4.8, numReviews: 143, images: [{ url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', alt: 'Passport Holder' }], description: 'Premium leather passport holder with RFID blocking. Fits passport, 4 cards, and boarding passes. Available in navy, tan, and black.', tags: ['passport', 'travel', 'rfid', 'leather'] },
  ];

  const created = await Product.insertMany(products);
  console.log(`Created ${created.length} products`);

  const orders = [
    {
      orderNumber: 'EZ-000001',
      user: users[1]._id,
      items: [
        { product: created[0]._id, name: created[0].name, image: created[0].images[0].url, price: 699,  quantity: 1 },
        { product: created[12]._id, name: created[12].name, image: created[12].images[0].url, price: 229, quantity: 1 }
      ],
      shippingAddress: { fullName: 'Sara Ahmed', street: '15 Tahrir St', city: 'Cairo', country: 'Egypt', zip: '11511', phone: '01012345678' },
      paymentMethod: 'cash_on_delivery', paymentStatus: 'paid', orderStatus: 'delivered',
      subtotal: 928, shippingCost: 0, tax: 92.80, totalAmount: 1020.80, deliveredAt: new Date(), paidAt: new Date()
    },
    {
      orderNumber: 'EZ-000002',
      user: users[2]._id,
      items: [
        { product: created[4]._id, name: created[4].name, image: created[4].images[0].url, price: 1899, quantity: 1 }
      ],
      shippingAddress: { fullName: 'Mohamed Ali', street: '22 Corniche', city: 'Alexandria', country: 'Egypt', zip: '21599', phone: '01198765432' },
      paymentMethod: 'credit_card', paymentStatus: 'paid', orderStatus: 'shipped',
      subtotal: 1899, shippingCost: 0, tax: 189.90, totalAmount: 2088.90, paidAt: new Date()
    },
    {
      orderNumber: 'EZ-000003',
      user: users[3]._id,
      items: [
        { product: created[8]._id, name: created[8].name, image: created[8].images[0].url, price: 999,  quantity: 1 },
        { product: created[14]._id, name: created[14].name, image: created[14].images[0].url, price: 849, quantity: 1 }
      ],
      shippingAddress: { fullName: 'Nour Hassan', street: '5 Mohandessin', city: 'Giza', country: 'Egypt', zip: '12411', phone: '01234567890' },
      paymentMethod: 'cash_on_delivery', paymentStatus: 'pending', orderStatus: 'processing',
      subtotal: 1848, shippingCost: 0, tax: 184.80, totalAmount: 2032.80
    },
  ];

  await Order.insertMany(orders);
  console.log('Seeded successfully!');
  console.log('Admin: admin@elza3eem.com / admin123');
  console.log('Customer: sara@example.com / customer123');
  mongoose.connection.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
