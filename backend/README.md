# ShopFlow Backend — REST API

Node.js + Express + MongoDB REST API for the ShopFlow e-commerce platform.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run dev
```

## Seed Database

```bash
node seed.js
# Admin: admin@shopflow.com / admin123
# Customer: jane@example.com / customer123
```

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login + get JWT |
| GET | /api/auth/me | Protected | Get current user profile |
| PUT | /api/auth/me | Protected | Update profile |
| PUT | /api/auth/change-password | Protected | Change password |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/products | Public | List products (search, filter, paginate) |
| GET | /api/products/featured | Public | Featured products |
| GET | /api/products/:id | Public | Single product detail |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Soft delete product |
| POST | /api/products/:id/reviews | Customer | Add review |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/categories | Public | All categories |
| POST | /api/categories | Admin | Create category |
| PUT | /api/categories/:id | Admin | Update category |
| DELETE | /api/categories/:id | Admin | Delete category |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/orders | Customer | Place order |
| GET | /api/orders/my | Customer | My orders |
| GET | /api/orders/:id | Customer/Admin | Order detail |
| GET | /api/orders | Admin | All orders |
| PUT | /api/orders/:id/status | Admin | Update order status |
| GET | /api/orders/admin/stats | Admin | Dashboard stats |

### Users (Admin)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Admin | All users |
| GET | /api/users/stats | Admin | User + platform stats |
| PUT | /api/users/:id | Admin | Update user role/status |
| DELETE | /api/users/:id | Admin | Deactivate user |

### Cart
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/cart/validate | Public | Validate cart + calculate totals |
