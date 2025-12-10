
import type { Product, Category, Review } from './constants';

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Featured Electronics', description: 'Latest and greatest gadgets', imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400' },
  { id: 'tools', name: 'Essential Tools', description: 'Tools for every job', imageUrl: 'https://images.unsplash.com/photo-1556997651-6dcc5a424e64?w=400' },
  { id: 'tyres', name: 'Veganic Tyres & Accessories', description: 'High-performance tyres', imageUrl: 'https://images.unsplash.com/photo-1599493356237-720647164228?w=400' },
  { id: 'vehicle-accessories', name: 'Vehicle Tyres & Accessories', description: 'Accessorize your ride', imageUrl: 'https://images.unsplash.com/photo-1614294121922-55325a7a7d4d?w=400' },
  { id: 'spare-parts', name: 'Spare Parts Hub', description: 'All the parts you need', imageUrl: 'https://images.unsplash.com/photo-1599331779815-3f30b2d35094?w=400' },
  { id: 'binders', name: 'Binders & Accessories', description: 'Stay organized', imageUrl: 'https://i.ibb.co/6yvY2p2/binders.png' },
  { id: 'sewing', name: 'Sewing Machine Parts', description: 'For all your sewing needs', imageUrl: 'https://i.ibb.co/3zd5v5f/sewing.png' },
  { id: 'pliers', name: 'Pliers', description: 'Get a grip', imageUrl: 'https://i.ibb.co/dGtCjH8/pliers.png' },
  { id: 'headsets', name: 'Bluetooth Headsets', description: 'Listen without limits', imageUrl: 'https://i.ibb.co/3d7M7d2/headsets.png' },
  { id: 'stencils', name: 'Rulers & Stencils', description: 'Precision tools', imageUrl: 'https://i.ibb.co/bFzL1pL/stencils.png' },
  { id: 'drives', name: 'Drives', description: 'Storage solutions', imageUrl: 'https://i.ibb.co/vYvYqR1/drives.png' },
  { id: 'batteries', name: 'Batteries', description: 'Power up your devices', imageUrl: 'https://i.ibb.co/j32B7zH/batteries.png' },
  { id: 'insect-killers', name: 'Electric Insect Killers', description: 'Bug-free living', imageUrl: 'https://i.ibb.co/L5T3hBB/insect-killer.png' },
  { id: 'fashion', name: 'Fashion', description: 'Style for everyone', imageUrl: 'https://picsum.photos/seed/fashion/400' },
  { id: 'health', name: 'Health & Beauty', description: 'Wellness products', imageUrl: 'https://picsum.photos/seed/health/400' },
];

export const REVIEWS: Review[] = [
    { 
      id: 'rev1', 
      productId: 201, 
      author: 'Mister', 
      rating: 5, 
      comment: "Product quality onek valo.tar thake valo jutar dam ta .11.11 campaign e 599 takar juta 360 taka deya nete parse.size o Ekdom perfect.seller response o onek fase .or paperfly courier super first 😁", 
      date: '2024-11-15',
      verifiedPurchase: true,
      imageUrls: ['https://i.ibb.co/pX1gX0s/sandal-main.png'],
      variantInfo: 'আকার:ইউ কে: 10., কালার_ফ্যামিলি:Deep Brown'
    },
    { id: 'rev2', productId: 201, author: 'John Doe', rating: 5, comment: "These are the most comfortable sandals I've ever owned! Perfect fit and great quality. Highly recommend.", date: '2024-07-15', verifiedPurchase: true },
    { id: 'rev3', productId: 201, author: 'Mike Smith', rating: 4, comment: "Very stylish and comfortable for everyday use. The color is exactly as shown.", date: '2024-07-12', verifiedPurchase: true },
    { id: 'rev4', productId: 201, author: 'Alex Ray', rating: 5, comment: "Excellent value for money. They feel durable and look great.", date: '2024-07-10', verifiedPurchase: false },
    { id: 'rev5', productId: 201, author: 'Sarah', rating: 3, comment: "Good product, but the delivery was a bit late.", date: '2024-06-20', verifiedPurchase: true },
    { id: 'rev6', productId: 201, author: 'Brian', rating: 2, comment: "Not what I expected. The color is a bit different.", date: '2024-05-18', verifiedPurchase: true },
    { 
      id: 'rev-kb-1', 
      productId: 202, 
      author: 'Honey', 
      rating: 5, 
      comment: "nice product... anyone can buy this", 
      date: '2024-08-24',
      verifiedPurchase: true,
      imageUrls: [
          'https://i.ibb.co/c85S1h7/review-kb-1.png',
          'https://i.ibb.co/Y0WfVpM/review-kb-2.png',
          'https://i.ibb.co/n60yR0d/review-kb-3.png',
          'https://i.ibb.co/L5V7V7v/review-kb-4.png',
          'https://i.ibb.co/pwnkP9G/review-kb-5.png',
      ],
      variantInfo: 'Color Family:White'
    },
];

export const PRODUCTS: Product[] = [
  // Flash Sale Products
  { id: 101, name: 'Weidasi WD-959 Mosquito Bat Rechargeable', description: 'Rechargeable mosquito bat for a bug-free environment.', price: 549, originalPrice: 800, imageUrl: 'https://i.ibb.co/gJFJHJq/mosquito-bat.png', categoryId: 'insect-killers' },
  { id: 102, name: 'LG Plus 32 Smart TV 4K Support FHD', description: '32-inch Smart TV with 4K support and FHD resolution.', price: 14100, originalPrice: 29700, imageUrl: 'https://i.ibb.co/4T7gHqN/tv.png', categoryId: 'electronics' },
  { id: 103, name: 'OnePlus Nord N30 SE 5G | 128GB ROM + 4GB RAM', description: 'Powerful 5G smartphone with ample storage and RAM.', price: 15949, originalPrice: 16999, imageUrl: 'https://i.ibb.co/F83S6hG/oneplus.png', categoryId: 'electronics' },
  { id: 104, name: 'ADIDAS ULTRARUN 5 CBACK/FTWWHT', description: 'High-performance running shoes from Adidas.', price: 8998, originalPrice: 11999, imageUrl: 'https://i.ibb.co/Bq5N1Ww/adidas.png', categoryId: 'fashion' },
  { id: 105, name: 'Mini Massage Gun Percussion Muscle...', description: 'Compact and powerful mini massage gun for muscle recovery.', price: 820, originalPrice: 1300, imageUrl: 'https://i.ibb.co/Yh4d5mD/massage-gun.png', categoryId: 'health' },
  { id: 106, name: 'Park Avenue Good Morning Perfume', description: 'A refreshing and long-lasting perfume for men.', price: 160, originalPrice: 425, imageUrl: 'https://i.ibb.co/pwnL1XN/perfume.png', categoryId: 'health' },

  // Regular Products
  { id: 1, name: 'Smartphone Pro', description: 'The latest smartphone with a stunning display.', price: 79999, imageUrl: 'https://picsum.photos/seed/phone1/400/300', categoryId: 'electronics', freeShipping: true, sold: 50 },
  { id: 2, name: 'Laptop Ultra', description: 'Powerful and lightweight for professionals.', price: 129999, imageUrl: 'https://picsum.photos/seed/laptop1/400/300', categoryId: 'electronics', sold: 23 },
  { id: 3, name: 'Wireless Earbuds', description: 'Crystal clear sound, all day comfort.', price: 4999, imageUrl: 'https://i.ibb.co/3d7M7d2/headsets.png', categoryId: 'headsets', freeShipping: true, sold: 888 },
  { id: 4, name: '4K Monitor', description: 'See every detail in stunning 4K.', price: 24999, imageUrl: 'https://picsum.photos/seed/monitor1/400/300', categoryId: 'electronics', freeShipping: true, sold: 112 },
  { id: 5, name: 'Cordless Drill', description: 'High-torque drill for tough jobs.', price: 6999, imageUrl: 'https://picsum.photos/seed/drill1/400/300', categoryId: 'tools', sold: 98 },
  { id: 6, name: 'Precision Pliers Set', description: 'A complete set of pliers for any job.', price: 1299, imageUrl: 'https://i.ibb.co/dGtCjH8/pliers.png', categoryId: 'pliers' },
  { id: 7, name: 'A4 Ring Binder', description: 'Durable and spacious ring binder.', price: 499, imageUrl: 'https://i.ibb.co/6yvY2p2/binders.png', categoryId: 'binders' },
  { id: 8, name: 'AA Rechargeable Batteries (4-pack)', description: 'Long-lasting power.', price: 899, imageUrl: 'https://i.ibb.co/j32B7zH/batteries.png', categoryId: 'batteries' },
  { id: 9, name: 'All-Season Tyre', description: 'Reliable performance in any weather.', price: 8500, imageUrl: 'https://picsum.photos/seed/tyre1/400/300', categoryId: 'tyres' },
  { id: 10, name: 'Performance Tyre', description: 'Maximum grip for spirited driving.', price: 12500, imageUrl: 'https://picsum.photos/seed/tyre2/400/300', categoryId: 'tyres' },
  { id: 11, name: 'Premium Alloy Wheels', description: 'Stylish and durable alloy wheels.', price: 45000, imageUrl: 'https://picsum.photos/seed/wheel1/400/300', categoryId: 'vehicle-accessories' },
  { id: 12, name: 'Roof Rack System', description: 'Carry more with this versatile roof rack.', price: 15000, imageUrl: 'https://picsum.photos/seed/roofrack1/400/300', categoryId: 'vehicle-accessories' },
  { id: 13, name: 'Brake Pad Set', description: 'High-quality brake pads for safety.', price: 3999, imageUrl: 'https://picsum.photos/seed/brake1/400/300', categoryId: 'spare-parts' },
  { id: 14, name: 'Spark Plugs (4-pack)', description: 'Improve engine efficiency and performance.', price: 1299, imageUrl: 'https://picsum.photos/seed/sparkplug1/400/300', categoryId: 'spare-parts' },
  {
    id: 201,
    name: 'Bata Pacific Slip-On Sandal For Men',
    description: 'Comfortable and stylish slip-on sandal for men, perfect for casual wear. Features a durable sole and a classic deep brown color.',
    price: 434,
    originalPrice: 1099,
    freeShipping: true,
    sold: 472,
    imageUrl: 'https://i.ibb.co/pX1gX0s/sandal-main.png',
    images: [
      'https://i.ibb.co/pX1gX0s/sandal-main.png',
      'https://i.ibb.co/VYqZpYg/sandal-2.png',
      'https://i.ibb.co/qD5xV1c/sandal-3.png',
      'https://i.ibb.co/mHxg0f3/sandal-4.png',
      'https://i.ibb.co/qY57b0L/sandal-size.png',
    ],
    categoryId: 'fashion',
    brand: 'Bata',
    colors: [
      { name: 'Deep Brown', imageUrl: 'https://i.ibb.co/pX1gX0s/sandal-main.png' }
    ],
    sizes: ['6', '7', '8', '9', '10'],
    rating: {
      stars: 4.0,
      count: 113,
    },
    answeredQuestions: 25,
    reviews: REVIEWS.filter(r => r.productId === 201),
  },
  {
    id: 202,
    name: 'Premium Quality - Rgb Gaming Keyboard Mouse Combo G21-B',
    description: `Elevate your gaming setup with this premium RGB gaming keyboard and mouse combo.
    
Featuring customizable lighting, ergonomic design, and responsive keys for an immersive experience. This combo is perfect for both casual and competitive gamers looking for performance and style.`,
    price: 1220,
    originalPrice: 1500,
    imageUrl: 'https://i.ibb.co/6wm16Y6/keyboard-main.png',
    images: [
      'https://i.ibb.co/6wm16Y6/keyboard-main.png',
      'https://i.ibb.co/qB6zypw/keyboard-2.png',
      'https://i.ibb.co/tZ5Z9sB/keyboard-3.png',
      'https://i.ibb.co/qFx5bMv/keyboard-4.png',
      'https://i.ibb.co/JqDBpPG/keyboard-5.png',
    ],
    categoryId: 'electronics',
    brand: 'No Brand',
    colors: [
      { name: 'White', imageUrl: 'https://i.ibb.co/qFx5bMv/keyboard-4.png' }
    ],
    rating: {
      stars: 4.5,
      count: 353,
      breakdown: {
        '5': 281,
        '4': 27,
        '3': 14,
        '2': 6,
        '1': 25,
      }
    },
    answeredQuestions: 92,
    reviews: REVIEWS.filter(r => r.productId === 202),
  }
];

// Order related types
export type OrderItem = {
  id: number;
  name: string;
  imageUrl: string;
  variant: string;
  price: number;
  quantity: number;
};

export type TrackingEvent = {
  timestamp: string;
  status: string;
  description: string;
};

export type Order = {
  id: string;
  sellerName: string;
  status: 'Shipped' | 'Completed' | 'Cancelled' | 'To Pay' | 'To ship' | 'To Receive' | 'To Review' | 'Delivered';
  items: OrderItem[];
  estimatedDelivery?: string;
  deliveryPartner?: string;
  trackingHistory?: TrackingEvent[];
};

// Mock data to represent the orders from the screenshot and for other tabs
export const mockOrders: Order[] = [
  {
    id: '680002557719421',
    sellerName: 'SK New Shop',
    status: 'Shipped',
    items: [
      {
        id: 1001,
        name: 'DIY Mosquito Killing Bat Circuit - mosquito bat',
        imageUrl: 'https://i.ibb.co/68gPZYy/mosquito-killer-circuit.png',
        variant: 'Color family:Multicolor',
        price: 139,
        quantity: 1,
      },
    ],
    estimatedDelivery: '16 Oct-20 Oct',
    deliveryPartner: 'BD-DEX',
    trackingHistory: [
      { timestamp: '16 Oct 10:32', status: 'Ready for Collection', description: 'Provide your OTP 736669 and collect your package at Pick-up Point [Sylhet Sadar]' },
      { timestamp: '15 Oct 21:05', status: 'Order Reached Delivery Facility', description: 'A rider/driver has been assigned to deliver your package. [Sylhet]' },
      { timestamp: '15 Oct 19:53', status: 'Order near your Delivery Facility', description: 'Order is near your Delivery Facility [Sylhet]' },
      { timestamp: '15 Oct 03:51', status: 'Departed from Daraz Distribution Center', description: 'Your order has departed from Daraz Distribution Center [Dhaka - North]' },
      { timestamp: '14 Oct 20:14', status: 'Order Reached at Daraz Distribution Center', description: 'Package is being sorted and will soon head to the delivery facility. [Dhaka - North]' },
    ]
  },
  {
    id: 'ORD124',
    sellerName: 'SL BD',
    status: 'Completed',
    items: [
      {
        id: 1002,
        name: 'Wire Stripper Cutter Tool,Multifunctional Wire Stripper Crimper Cable Cutter Pliers, Electri...',
        imageUrl: 'https://i.ibb.co/BGCs76Z/wire-stripper.png',
        variant: 'Color family:Wire Cutter-8.5inch',
        price: 349,
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD125',
    sellerName: 'SL BD',
    status: 'Cancelled',
    items: [
       {
        id: 1003,
        name: 'Adjustable Wrench and Plier Set',
        imageUrl: 'https://i.ibb.co/dGtCjH8/pliers.png',
        variant: 'Color family:Black',
        price: 199,
        quantity: 1,
      },
    ],
  },
    {
    id: 'ORD126',
    sellerName: 'Electronics Hub',
    status: 'To Receive',
    items: [
      {
        id: 1, 
        name: 'Smartphone Pro',
        imageUrl: 'https://picsum.photos/seed/phone1/400/300',
        variant: 'Color: Black',
        price: 79999,
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD127',
    sellerName: 'Tools Direct',
    status: 'To Review',
    items: [
       {
        id: 5, 
        name: 'Cordless Drill',
        imageUrl: 'https://picsum.photos/seed/drill1/400/300',
        variant: 'Voltage: 20V',
        price: 6999,
        quantity: 1,
      },
    ],
  },
];
