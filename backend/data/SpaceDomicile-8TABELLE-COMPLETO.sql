-- =====================================================
-- SPACDOMICILE - DATABASE COMPLETO CON 8 TABELLE + DATI
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `invoices_stack`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `stacks`;
DROP TABLE IF EXISTS `planets`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `galaxies`;

-- =====================================================
-- CREATE TABLE GALAXIES
-- =====================================================

CREATE TABLE `galaxies`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE PLANETS
-- =====================================================

CREATE TABLE `planets`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_galaxy` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `planet_size` BIGINT NOT NULL,
  `temperature_min` INT NOT NULL,
  `temperature_max` INT NOT NULL,
  `population` BIGINT NOT NULL,
  `surface_available` BIGINT NOT NULL,
  `distance_from_earth` BIGINT NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE STACKS
-- =====================================================

CREATE TABLE `stacks`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_planet` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  `stock` MEDIUMINT NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL
);

ALTER TABLE `stacks` ADD UNIQUE `stacks_slug_unique`(`slug`);

-- =====================================================
-- CREATE TABLE INVOICES_STACK
-- =====================================================

CREATE TABLE `invoices_stack`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stack_id` INT UNSIGNED NOT NULL,
  `invoices_id` INT UNSIGNED NOT NULL,
  `price` DECIMAL(8, 2) NOT NULL,
  `quantity` SMALLINT NOT NULL,
  `stack_name` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE INVOICES
-- =====================================================

CREATE TABLE `invoices`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `shipping_address` VARCHAR(255) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `invoice_address` VARCHAR(255) NOT NULL,
  `invoice_email` VARCHAR(255) NOT NULL,
  `invoice_date` TIMESTAMP NOT NULL,
  `invoice_status` VARCHAR(255) NOT NULL
);

-- =====================================================
-- CREATE TABLE CUSTOMERS
-- =====================================================

CREATE TABLE `customers`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `billing_address` VARCHAR(255) NOT NULL,
  `default_shipping_address` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL
);

ALTER TABLE `customers` ADD UNIQUE `customers_email_unique`(`email`);

-- =====================================================
-- CREATE TABLE PAYMENTS
-- =====================================================

CREATE TABLE `payments`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoices_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `method` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `transaction_id` VARCHAR(255) NOT NULL,
  `paid_at` DATETIME NOT NULL
);

-- =====================================================
-- CREATE TABLE CERTIFICATES
-- =====================================================

CREATE TABLE `certificates`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stack_invoices_id` INT UNSIGNED NOT NULL,
  `certificate_code` VARCHAR(255) NOT NULL,
  `issued_at` TIMESTAMP NOT NULL,
  `pdf_url` VARCHAR(255) NOT NULL
);

-- =====================================================
-- ADD FOREIGN KEYS
-- =====================================================

ALTER TABLE `payments` ADD CONSTRAINT `payments_invoices_id_foreign` FOREIGN KEY(`invoices_id`) REFERENCES `invoices`(`id`);

ALTER TABLE `certificates` ADD CONSTRAINT `certificates_stack_invoices_id_foreign` FOREIGN KEY(`stack_invoices_id`) REFERENCES `invoices_stack`(`id`);

ALTER TABLE `invoices_stack` ADD CONSTRAINT `invoices_stack_invoices_id_foreign` FOREIGN KEY(`invoices_id`) REFERENCES `invoices`(`id`);

ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`);

ALTER TABLE `stacks` ADD CONSTRAINT `stacks_id_planet_foreign` FOREIGN KEY(`id_planet`) REFERENCES `planets`(`id`);

ALTER TABLE `planets` ADD CONSTRAINT `planets_id_galaxy_foreign` FOREIGN KEY(`id_galaxy`) REFERENCES `galaxies`(`id`);

ALTER TABLE `invoices_stack` ADD CONSTRAINT `invoices_stack_stack_id_foreign` FOREIGN KEY(`stack_id`) REFERENCES `stacks`(`id`);

-- =====================================================
-- INSERT DATA INTO GALAXIES
-- =====================================================

INSERT INTO `galaxies` (`id`, `name`, `description`) VALUES
(1, 'Via Lattea', 'La nostra galassia spirale nel cuore dell universo'),
(2, 'Andromeda', 'La galassia piu vicina alla Via Lattea');

-- =====================================================
-- INSERT DATA INTO PLANETS
-- =====================================================

INSERT INTO `planets` (`id`, `id_galaxy`, `name`, `planet_size`, `temperature_min`, `temperature_max`, `population`, `surface_available`, `distance_from_earth`, `description`, `image`) VALUES
(1, 1, 'Mercurio', 74797000, -173, 427, 0, 74797000, 57909050, 'Il pianeta piu piccolo e vicino al sole', 'mercurio.jpg'),
(2, 1, 'Venere', 460234000, 462, 462, 0, 460234000, 108208000, 'Il pianeta piu caldo con vulcani attivi', 'venere.jpg'),
(3, 1, 'Marte', 144371000, -125, 20, 3933000000, 144371000, 227923000, 'Il pianeta rosso ideale per colonizzazione', 'marte.jpg'),
(4, 1, 'Giove', 61418000000, -110, 24, 318000000000, 61418000000, 778570000, 'Il gigante gassoso piu grande del sistema', 'giove.jpg'),
(5, 1, 'Saturno', 50724000000, -140, 27, 95000000000, 50724000000, 1429400000, 'Il pianeta con gli anelli spettacolari', 'saturno.jpg'),
(6, 1, 'Urano', 15759200000, -224, -97, 14700000000, 15759200000, 2870972000, 'Il gigante di ghiaccio con rotazione anomala', 'urano.jpg'),
(7, 1, 'Nettuno', 17148300000, -200, -100, 17000000000, 17148300000, 4495060000, 'Il pianeta piu lontano dal sole', 'nettuno.jpg');

-- =====================================================
-- INSERT DATA INTO CUSTOMERS
-- =====================================================

INSERT INTO `customers` (`id`, `email`, `full_name`, `billing_address`, `default_shipping_address`, `country`, `phone`) VALUES
(1, 'marco.rossi@email.com', 'Marco Rossi', 'Via Roma 123, Milano', 'Via Roma 123, Milano', 'Italia', '+39 3331234567'),
(2, 'anna.bianchi@email.com', 'Anna Bianchi', 'Piazza Duomo 456, Roma', 'Piazza Duomo 456, Roma', 'Italia', '+39 3339876543'),
(3, 'giuseppe.verdi@email.com', 'Giuseppe Verdi', 'Viale Liberta 789, Palermo', 'Viale Liberta 789, Palermo', 'Italia', '+39 3334567890'),
(4, 'francesca.neri@email.com', 'Francesca Neri', 'Corso Garibaldi 321, Torino', 'Corso Garibaldi 321, Torino', 'Italia', '+39 3332345678'),
(5, 'luca.ferrari@email.com', 'Luca Ferrari', 'Via Dante 654, Firenze', 'Via Dante 654, Firenze', 'Italia', '+39 3336789012');

-- =====================================================
-- INSERT DATA INTO STACKS
-- =====================================================

INSERT INTO `stacks` (`id`, `id_planet`, `name`, `price`, `stock`, `slug`, `title`, `description`) VALUES
(1, 1, 'Suolo Mercuriano', 249.99, 100, 'mercurio-suolo', '500g Suolo Mercurio', 'Regolite autentica dalla superficie di Mercurio'),
(2, 2, 'Roccia Venusiana', 199.99, 150, 'venere-roccia', '1kg Roccia Venere', 'Roccia vulcanica dalla superficie di Venere'),
(3, 3, 'Suolo Marziano Base', 299.99, 200, 'marte-base', '1 Ettaro Marte', 'Suolo arrossato ricco di ossidi'),
(4, 3, 'Suolo Marziano Premium', 899.99, 50, 'marte-premium', '5 Ettari Marte Premium', 'Terreno selezionato dai crateri fertili'),
(5, 4, 'Polvere Gioviana', 149.99, 300, 'giove-polvere', '1kg Polvere Giove', 'Campione dalla composizione gassosa'),
(6, 5, 'Cristalli Saturniani', 399.99, 80, 'saturno-cristalli', '500g Cristalli Saturno', 'Cristalli dalle fasce atmosferiche'),
(7, 6, 'Ghiaccio Uraniano', 349.99, 120, 'urano-ghiaccio', '1kg Ghiaccio Urano', 'Ghiaccio cosmico dalle profondita'),
(8, 7, 'Cristalli Nettuniani', 429.99, 90, 'nettuno-cristalli', '500g Cristalli Nettuno', 'Formazioni cristalline uniche');

-- =====================================================
-- LE 4 TABELLE RIMANENTI SONO VUOTE (per ora):
-- - invoices
-- - invoices_stack
-- - payments
-- - certificates
-- =====================================================
-- Quste tabelle verranno popolate durante l uso dell app
-- quando i clienti faranno ordini, pagamenti, etc.

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- VERIFICA DATI IMPORTATI
-- =====================================================
-- SELECT COUNT(*) FROM galaxies;     -- Dovrebbe essere 2
-- SELECT COUNT(*) FROM planets;      -- Dovrebbe essere 7
-- SELECT COUNT(*) FROM customers;    -- Dovrebbe essere 5
-- SELECT COUNT(*) FROM stacks;       -- Dovrebbe essere 8
-- SELECT COUNT(*) FROM invoices;     -- Dovrebbe essere 0
-- SELECT COUNT(*) FROM invoices_stack; -- Dovrebbe essere 0
-- SELECT COUNT(*) FROM payments;     -- Dovrebbe essere 0
-- SELECT COUNT(*) FROM certificates; -- Dovrebbe essere 0

-- =====================================================
-- COMPLETO! 8 TABELLE + DATI
-- =====================================================

