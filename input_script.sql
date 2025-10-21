USE mydb;

-- ========== USERS ==========
INSERT INTO User (email, password_hash, phone_number, full_name, date_of_birth, gender, registration_date, is_active, is_verified)
VALUES 
('alice@example.com', 'pw_hash_1', '0123456789', 'Alice Nguyen', '1998-05-14', 'Female', NOW(), 1, 1),
('bob@example.com', 'pw_hash_2', '0987654321', 'Bob Tran', '1995-11-03', 'Male', NOW(), 1, 0);

-- ========== ADDRESS ==========
INSERT INTO Address (user_id, address_type, street_address, city, district, postal_code, country, is_default, phone_number)
VALUES
(1, 'Home', '123 Main St', 'HCMC', 'District 1', '700000', 'Vietnam', 1, '0123456789'),
(2, 'Office', '88 Nguyen Trai', 'Hanoi', 'Ba Dinh', '100000', 'Vietnam', 0, '0987654321');

-- ========== CATEGORY ==========
INSERT INTO Category (name, description)
VALUES
('Electronics', 'Smartphones and gadgets'),
('Clothing', 'Fashion and apparel');

-- ========== BRAND ==========
INSERT INTO Brand (name, description, created_at)
VALUES
('Samsung', 'Electronics manufacturer', NOW()),
('Nike', 'Global sportswear brand', NOW());

-- ========== PRODUCT ==========
INSERT INTO Product (name, description, price, stock_quantity, category_id, brand_id, is_active, created_at)
VALUES
('Galaxy S23', 'Samsung flagship smartphone', 999.99, 30, 1, 1, 1, NOW()),
('Nike Air Max', 'Comfortable sneakers', 150.00, 100, 2, 2, 1, NOW());

-- ========== CART ==========
INSERT INTO Cart (user_id, created_at, updated_at)
VALUES
(1, NOW(), NOW()),
(2, NOW(), NOW());

-- ========== CART ITEMS ==========
INSERT INTO CartItem (cart_id, product_id, quantity, price_at_time)
VALUES
(1, 1, 1, 999.99),
(2, 2, 2, 150.00);

-- ========== WISHLIST ==========
INSERT INTO Wishlist (user_id, created_at)
VALUES
(1, NOW()),
(2, NOW());

-- ========== WISHLIST ITEMS ==========
INSERT INTO WishlistItem (wishlist_id, product_id, added_at)
VALUES
(1, 1, NOW()),
(2, 2, NOW());

-- ========== ORDERS ==========
INSERT INTO `Order` (user_id, address_id, status, total_amount, order_date, payment_method)
VALUES
(1, 1, 'Processing', 999.99, NOW(), 'Credit Card'),
(2, 2, 'Delivered', 300.00, NOW(), 'Cash');

-- ========== ORDER ITEMS ==========
INSERT INTO OrderItem (order_id, product_id, quantity, price_at_time)
VALUES
(1, 1, 1, 999.99),
(2, 2, 2, 150.00);

-- ========== PAYMENT ==========
INSERT INTO Payment (order_id, amount, status, payment_date, transaction_id)
VALUES
(1, 999.99, 'Paid', NOW(), 'TXN10001'),
(2, 300.00, 'Pending', NOW(), 'TXN10002');

-- ========== REVIEWS ==========
INSERT INTO Review (product_id, user_id, rating, comment, review_date)
VALUES
(1, 1, 5, 'Excellent phone!', NOW()),
(2, 2, 4, 'Good shoes but pricey.', NOW());
