-- 0. Fix missing columns and strict constraints in the new database
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "image_urls" text[];
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "color_options" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "size_matrix" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "has_custom_measurement" boolean DEFAULT false;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "interactive_addons" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "hero_image_concept" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "view_360_url" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "video_url" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "hook_text" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "deep_dive_description" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "fabric_care" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "sizing_note" text;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "is_best_selling" boolean DEFAULT false;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "is_new_arrival" boolean DEFAULT false;

ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "customer_name" text;
ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "customer_phone" text;
ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "customer_address" text;
ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "shipping_address" text;
ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "total_amount" numeric;
ALTER TABLE "public"."orders" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "public"."orders" ALTER COLUMN "customer_email" DROP NOT NULL;
ALTER TABLE "public"."orders" ALTER COLUMN "shipping_address" DROP NOT NULL;

ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "quantity" numeric;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "price_at_purchase" numeric;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "price_at_time" numeric;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "selected_color" text;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "selected_size" text;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "custom_measurement" text;
ALTER TABLE "public"."order_items" ADD COLUMN IF NOT EXISTS "selected_addon" text;
ALTER TABLE "public"."order_items" ALTER COLUMN "price_at_time" DROP NOT NULL;

ALTER TABLE "public"."customer_reviews" ADD COLUMN IF NOT EXISTS "customer_name" text;
ALTER TABLE "public"."customer_reviews" ADD COLUMN IF NOT EXISTS "rating" numeric;
ALTER TABLE "public"."customer_reviews" ADD COLUMN IF NOT EXISTS "review_text" text;
ALTER TABLE "public"."customer_reviews" ADD COLUMN IF NOT EXISTS "is_approved" boolean DEFAULT false;
ALTER TABLE "public"."customer_reviews" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false;

ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "media_url" text;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "link_url" text;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "media_type" text;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "public"."hero_banners" ADD COLUMN IF NOT EXISTS "display_order" numeric;
ALTER TABLE "public"."hero_banners" ALTER COLUMN "image_url" DROP NOT NULL;
ALTER TABLE "public"."hero_banners" ALTER COLUMN "link_url" DROP NOT NULL;

ALTER TABLE "public"."settings" ADD COLUMN IF NOT EXISTS "key" text;
ALTER TABLE "public"."settings" ADD COLUMN IF NOT EXISTS "value" text;

ALTER TABLE "public"."user_roles" ADD COLUMN IF NOT EXISTS "email" text;
ALTER TABLE "public"."user_roles" ADD COLUMN IF NOT EXISTS "role" text;

-- 1. Insert Products
INSERT INTO "public"."products" ("id", "title", "description", "price", "image_urls", "quantity", "is_active", "brand", "category", "created_at", "color_options", "size_matrix", "has_custom_measurement", "interactive_addons", "hero_image_concept", "view_360_url", "video_url", "hook_text", "deep_dive_description", "fabric_care", "sizing_note", "is_best_selling", "is_new_arrival") VALUES 
('0062bb7c-92e2-4312-82fb-33ee63fcd5d0', 'Sky blue corset kurti', '', '2600.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.3029160377894219.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.15175029531013529.jpeg'], 5, true, 'luxereen_wears', 'Fusion & Printed Kurtis', '2026-06-15 19:49:20.298226+00', '', 'XS, S, M', false, '', '', '', '', 'Basic and chic', '', 'Imported Korean Crepe.', 'This set features adjustable corset back. Please do check our size chart in highlights before placing your order.', false, false), 
('6c06eaa7-abe3-4d82-9c50-a1af0ed09503', 'Chikan kari Mor', '', '7000.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.08854577523032647.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.4993400024524246.jpeg'], 10, true, 'luxereen_wears', 'Corset Co-ord Sets', '2026-06-17 16:37:48.366869+00', 'Black', 'XS, S, M', false, '', '', '', '', '', '', 'Chikan kari lawn shirt
Imported korean crepe shalwar', '', false, false), 
('7315fbb1-bec0-43b5-8f9a-c25fec2a7cbd', 'Solid corset Coord set', '', '4000.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.9731677423433468.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.7625858643264236.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.6114346488613017.jpeg'], 4, true, 'luxereen_wears', 'Solid & Casual Two-Piece Co-ords', '2026-06-11 16:15:30.193052+00', 'Maroon, White, Black', 'XS, S, M', false, '', '', '', '', 'For the girlies who love chic with desi.', 'Crafted for the modern fashion forward women.', '100% Premium cotton. 
', 'This set features an adjustable corset back.', false, false), 
('7512d7d7-c036-4af9-9723-be67a1a0a249', 'Lilac corset kurti', '', '2600.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.0201798803391966.png'], 5, true, 'luxereen_wears', 'Fusion & Printed Kurtis', '2026-06-15 19:45:23.837182+00', '', 'XS, S, M', false, '', '', '', '', '', '', 'Imported korean crepe', 'This set features an adjustable corset back. Please go through the size chart in our highlights before ordering.', false, false), 
('a90512f6-4566-43bb-b52f-4b77ec9aa5a4', '“MOR” ', '', '5199.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.10040791390997594.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.4860222449566308.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.7722091858360727.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.13463501302559122.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.7014711495693395.jpeg'], 0, true, 'luxereen_wears', 'Corset Co-ord Sets', '2026-06-11 16:09:47.117434+00', 'White, Black', 'XS, S, M', false, '', '', '', '', 'Designed for the morni’s.', 'Embrace effortless elegance with this beautifully crafted summer dress, designed to keep you feeling light, comfortable, and confident all season long. 
Featuring a MOR printed shalwar free sized elastic waist with 39inches length & an A-line shirt with square neckline and corset back with length 33inches.', 'To maintain the beauty and quality of your imported Korean crepe shirt and printed shalwar, hand wash gently in cold water with a mild detergent. Avoid bleach and harsh chemicals, as they may affect the fabric texture and print. Do not wring excessively; instead, dry in shade to preserve color vibrancy. Iron on low heat from the reverse side if needed. Proper care will keep your outfit looking fresh, elegant, and long-lasting. ✨', 'features an adjustable corset back.', true, false), 
('fc1cfd5e-1c0a-444a-b40c-fc02faa1f1ca', 'Blue Fairy kurti', '', '2600.00', ARRAY['https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.73320831739155.jpeg','https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/product-images/0.9745644186002684.jpeg'], 3, true, 'luxereen_wears', 'Fusion & Printed Kurtis', '2026-06-11 16:19:44.78169+00', 'Blue', 'XS, S, M', false, '', '', '', '', 'Chatpate fits💅', 'Corset back kurti only for the chatpati girls.', 'Soft summer Arabian linen.', '', false, false)
ON CONFLICT ("id") DO NOTHING;

-- 2. Insert Orders
INSERT INTO "public"."orders" ("id", "customer_name", "customer_phone", "customer_address", "shipping_address", "total_amount", "status", "created_at") VALUES 
('041ee810-82af-4e2b-baa7-9d1d80046b2f', 'Muhammad shahid', '03063251755', 'Faiz eAmm nursery chowk doctor plus pharmacy nawabpur road , Nawabpur 
Multan , Punjab  60000
Pakistan

[Payment Method: COD]
[Delivery Charge: Rs. 400]', 'Faiz eAmm nursery chowk doctor plus pharmacy nawabpur road , Nawabpur 
Multan , Punjab  60000
Pakistan', '5250.00', 'Pending', '2026-06-23 07:14:52.697392+00'), 
('165a6a7f-c95a-41a2-adb5-dcaac9cbf9fc', 'Zuhaa Zeeshan ', '+923259453156', '114 - Rehman Villas Defense Road, Lahore Cantt, Street 4
Lahore, Punjab  54792
Pakistan 

[Payment Method: COD]
[Delivery Charge: Rs. 400]', '114 - Rehman Villas Defense Road, Lahore Cantt, Street 4
Lahore, Punjab  54792
Pakistan', '5250.00', 'Pending', '2026-06-15 12:46:37.050345+00'), 
('2380509c-f5bd-4721-97a4-4e7a83565948', 'Rukhsana kousar', '03071767604', 'Muhallah Islam Pura Nisbat Road Gali Masjid Faiz E Rasool Wali Daska, Nisbat road 
Sialkot, Punjab 51010
PK

[Payment Method: COD]
[Delivery Charge: Rs. 400]', 'Muhallah Islam Pura Nisbat Road Gali Masjid Faiz E Rasool Wali Daska, Nisbat road 
Sialkot, Punjab 51010
PK', '5250.00', 'Pending', '2026-06-17 17:55:40.790334+00'), 
('2b1d0d94-ba63-4e29-a69c-851058bb5597', 'Alishba', '0303 4458882', 'E474-6 park lane housing society fort villas main boulevard DHA lahore, Fort Villa
Lahore Cant, Punjab 54791
Pakistan

[Payment Method: COD]
[Delivery Charge: Rs. 400]', 'E474-6 park lane housing society fort villas main boulevard DHA lahore, Fort Villa
Lahore Cant, Punjab 54791
Pakistan', '5250.00', 'Pending', '2026-06-18 16:17:26.007001+00'), 
('45c12a64-fc9e-4977-894d-e92eb4ff2764', 'Alizeh Faraz', '03234671049', '301 A sui gas phase 2 lahore

[Payment Method: COD]', '301 A sui gas phase 2 lahore', '4850.00', 'Pending', '2026-06-13 11:04:33.447435+00'), 
('8d705314-c1d6-47b7-94e3-09e84174838f', 'Maryam Abubakar ', '03214687019', 'House # 1 A Nazarya e Pakistan Road, opp Shaukat Khanaam Hospital, Iqbal Avenue 
Lahore , Punjab  54000
Pakistan 

[Payment Method: COD]
[Delivery Charge: Rs. 400]', 'House # 1 A Nazarya e Pakistan Road, opp Shaukat Khanaam Hospital, Iqbal Avenue 
Lahore , Punjab  54000
Pakistan', '5250.00', 'Pending', '2026-06-24 07:27:41.408343+00'), 
('b87f55e9-981a-41a1-9bb5-7d7640f252ea', 'Fatima Tul zahra', '03080059117', 'Sir Syed girls hostel near salad Masjid allah wala town korangi karachi, Sector H
Karachi, Sindh 74900
Pakistan

[Payment Method: COD]
[Delivery Charge: Rs. 300]', 'Sir Syed girls hostel near salad Masjid allah wala town korangi karachi, Sector H
Karachi, Sindh 74900
Pakistan', '5150.00', 'Pending', '2026-06-17 17:15:23.983009+00'), 
('e39ebf69-7b53-4824-af75-e0b97d731c0e', 'Zarka naz', '03333976731', 'House no: 689, street 11, iqbal villa, precint-2, bahria town karachi, Pricent 2 iqbal villa
Bahria Town Karachi, Sindh 75000
PK

[Payment Method: COD]
[Delivery Charge: Rs. 300]', 'House no: 689, street 11, iqbal villa, precint-2, bahria town karachi, Pricent 2 iqbal villa
Bahria Town Karachi, Sindh 75000
PK', '5150.00', 'Pending', '2026-06-21 17:34:00.225069+00'), 
('f206dc29-97ed-45ca-8a5d-bd042797fa69', 'Fizza Maheen', '03338669088', 'A450  street 2A pm colony wah cantt, Prime minister colony 
Wah Cantt, Punjab 47040
Pakistan

[Payment Method: COD]
[Delivery Charge: Rs. 400]', 'A450  street 2A pm colony wah cantt, Prime minister colony 
Wah Cantt, Punjab 47040
Pakistan', '5250.00', 'Pending', '2026-06-20 14:07:25.121115+00')
ON CONFLICT ("id") DO NOTHING;

-- 3. Insert Order Items 
INSERT INTO "public"."order_items" ("id", "order_id", "product_id", "quantity", "price_at_purchase", "price_at_time", "selected_color", "selected_size", "custom_measurement", "selected_addon") VALUES 
('1378efd0-684d-4c8d-9b43-ed55fb04fa78', '2b1d0d94-ba63-4e29-a69c-851058bb5597', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'S', null, null), 
('207bf780-c73a-4ae7-8dae-1ce6eaab0543', '165a6a7f-c95a-41a2-adb5-dcaac9cbf9fc', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', null, null, null, null), 
('28fe0249-356f-4575-a35a-566366671eef', 'f206dc29-97ed-45ca-8a5d-bd042797fa69', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'M', null, null), 
('a7dc1836-5b32-4a91-8c32-357a26407fc9', 'e39ebf69-7b53-4824-af75-e0b97d731c0e', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'S', null, null), 
('a90a75b8-4068-49ef-8885-88591e3b3661', '45c12a64-fc9e-4977-894d-e92eb4ff2764', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', null, null, null, null), 
('b51be796-b09a-4bc2-8cb4-8fe2e871d4dd', '8d705314-c1d6-47b7-94e3-09e84174838f', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'S', null, null), 
('b87d155f-9ee2-4158-9e51-7edfe03941db', '2380509c-f5bd-4721-97a4-4e7a83565948', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'S', null, null), 
('d59ab37b-a8fc-456e-92b4-76fb46b8adcb', '041ee810-82af-4e2b-baa7-9d1d80046b2f', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'S', null, null), 
('f11846d8-406c-4ee2-8ac0-6da74daf6fa4', 'b87f55e9-981a-41a1-9bb5-7d7640f252ea', 'a90512f6-4566-43bb-b52f-4b77ec9aa5a4', 1, '4850.00', '4850.00', 'White', 'M', null, null)
ON CONFLICT ("id") DO NOTHING;

-- 4. Insert Customer Reviews
INSERT INTO "public"."customer_reviews" ("id", "customer_name", "rating", "review_text", "is_approved", "is_featured", "created_at") VALUES 
('0a407c42-7c48-4c56-bcc5-afaaed5e5f72', 'Mariam K.', 5, 'My favorite place to shop for modern fusion wear. The quality of the traditional jhumkas perfectly matches their aesthetic clothing line.', true, true, '2026-05-28 23:03:59.834473+00'), 
('2ab143ea-9ff2-4a45-b8f2-b9cfbfcc2420', 'Zara A.', 5, 'The permanent bracelet kit is literally the best thing ever. So seamless and beautiful! I haven''t taken it off since I got it.', true, true, '2026-05-28 23:03:59.834473+00'), 
('c02042c2-1103-4f1e-bfdb-7fe56abb23c1', 'Hina F.', 5, 'I bought the Fuchsia Corset Set for a dinner party and the fit is absolutely breathtaking. The cotton lawn is so breathable but looks so expensive.', true, true, '2026-05-28 23:03:59.834473+00')
ON CONFLICT ("id") DO NOTHING;

-- 5. Insert Hero Banners
INSERT INTO "public"."hero_banners" ("id", "title", "media_url", "image_url", "link_url", "media_type", "is_active", "display_order", "created_at") VALUES 
('06b8c6a7-bc5f-43e6-8c69-e3f9240fffe7', 'byreen.xo_page_hero_desktop', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.14393872310860878.png', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.14393872310860878.png', '/', 'image', true, 0, '2026-05-28 08:11:28.589844+00'), 
('469bbb51-c2a4-4abb-9492-964ada24a92a', 'luxereen.wears_page_hero_desktop', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.8704970964925782.png', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.8704970964925782.png', '/', 'image', true, 0, '2026-05-28 00:05:28.67985+00'), 
('9781648f-317d-47b5-8e25-658e47a96222', 'Home_page_hero_desktop', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.10207008452792443.jpeg', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.10207008452792443.jpeg', '/', 'image', true, 0, '2026-06-12 03:45:33.894766+00'), 
('b1415137-9e8e-4334-a1c1-589e772e99c3', 'Home_page_hero_mobile', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.9907613742523389.jpeg', 'https://axsqlwhreervfzrsqcin.supabase.co/storage/v1/object/public/media/0.9907613742523389.jpeg', '/', 'image', true, 0, '2026-06-14 21:34:04.245167+00')
ON CONFLICT ("id") DO NOTHING;

-- 6. Insert Settings
INSERT INTO "public"."settings" ("key", "value") VALUES 
('hide_byreen_xo', 'true'), 
('hide_luxereen_wears', 'false'), 
('payment_details', '')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";

-- 7. Insert User Roles
INSERT INTO "public"."user_roles" ("id", "email", "role", "created_at") VALUES 
('23eaf4cc-86d4-4977-9ac7-0b26d56ef710', 'farheenzehragilani@gmail.com', 'admin', '2026-06-11 12:04:13.709172+00')
ON CONFLICT DO NOTHING;
