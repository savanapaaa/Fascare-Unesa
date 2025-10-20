-- MySQL database dump for UrbanAID
-- Database: urbanaid_db

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS urbanaid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE urbanaid_db;

-- Table structure for admins
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','superadmin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CHECK (`role` IN ('admin','superadmin'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for users  
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for laporan_masuk
CREATE TABLE `laporan_masuk` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `jenis_infrastruktur` enum('perkotaan','lingkungan','ekonomi','sosial') NOT NULL,
  `tanggal_kejadian` date NOT NULL,
  `alamat_kejadian` text NOT NULL,
  `lampiran` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','diterima','ditolak') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `laporan_masuk_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for riwayat_laporan
CREATE TABLE `riwayat_laporan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `jenis_infrastruktur` enum('perkotaan','lingkungan','ekonomi','sosial') NOT NULL,
  `tanggal_kejadian` date NOT NULL,
  `alamat_kejadian` text NOT NULL,
  `lampiran` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `user_id` int NOT NULL,
  `status` enum('diterima','ditolak') NOT NULL,
  `admin_response` text,
  `processed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `riwayat_laporan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for reviews
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `laporan_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `komentar` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`laporan_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `riwayat_laporan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CHECK (`rating` >= 1 AND `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for admins (password: admin123)
INSERT INTO `admins` (`nama`, `email`, `password`, `role`) VALUES
('Super Admin', 'superadmin@urbanaid.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L', 'superadmin'),
('Admin Jakarta', 'admin.jakarta@urbanaid.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L', 'admin'),
('Admin Bandung', 'admin.bandung@urbanaid.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L', 'admin');

-- Sample data for users (password: user123)  
INSERT INTO `users` (`nama`, `email`, `password`) VALUES
('John Doe', 'john.doe@email.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L'),
('Jane Smith', 'jane.smith@email.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L'),
('Ahmad Rahman', 'ahmad.rahman@email.com', '$2b$10$8K3H5J2L9M4N6P8Q1R3T5V7W9X1Y3Z5A7B9C1D3E5F7G9H1I3J5K7L');

-- Sample data for laporan_masuk
INSERT INTO `laporan_masuk` (`judul`, `deskripsi`, `jenis_infrastruktur`, `tanggal_kejadian`, `alamat_kejadian`, `lampiran`, `latitude`, `longitude`, `user_id`, `status`) VALUES
('Jalan Berlubang di Jl. Sudirman', 'Terdapat lubang besar di jalan yang berbahaya bagi pengendara', 'perkotaan', '2024-12-10', 'Jl. Sudirman No. 45, Jakarta Pusat', '/uploads/jalan-lubang-1.jpg', -6.2088000, 106.8456000, 1, 'pending'),
('Drainase Tersumbat', 'Saluran air di kompleks perumahan tersumbat sampah', 'lingkungan', '2024-12-12', 'Perumahan Graha Indah Blok A', '/uploads/drainase-1.jpg', -6.3751000, 106.8350000, 2, 'diterima'),
('Lampu Jalan Mati', 'Lampu penerangan jalan tidak menyala sudah 3 hari', 'perkotaan', '2024-12-08', 'Jl. Kebon Jeruk Raya', '/uploads/lampu-mati-1.jpg', -6.1944000, 106.7831000, 3, 'pending');

-- Sample data for riwayat_laporan
INSERT INTO `riwayat_laporan` (`judul`, `deskripsi`, `jenis_infrastruktur`, `tanggal_kejadian`, `alamat_kejadian`, `lampiran`, `latitude`, `longitude`, `user_id`, `status`, `admin_response`) VALUES
('Perbaikan Jembatan Rusak', 'Jembatan penyeberangan mengalami kerusakan pada bagian lantai', 'perkotaan', '2024-11-15', 'Jl. Gatot Subroto KM 5', '/uploads/jembatan-rusak-1.jpg', -6.2297000, 106.8070000, 1, 'diterima', 'Laporan telah ditindaklanjuti. Perbaikan jembatan akan dilakukan dalam 2 minggu ke depan.'),
('Taman Kota Kotor', 'Taman kota penuh sampah dan tidak terawat', 'lingkungan', '2024-11-20', 'Taman Suropati, Jakarta Pusat', '/uploads/taman-kotor-1.jpg', -6.1944000, 106.8229000, 2, 'diterima', 'Tim kebersihan telah membersihkan area taman. Terima kasih atas laporannya.'),
('Fasilitas Toilet Umum Rusak', 'Toilet umum di stasiun tidak berfungsi', 'sosial', '2024-11-25', 'Stasiun Gambir, Jakarta Pusat', '/uploads/toilet-rusak-1.jpg', -6.1666000, 106.8316000, 3, 'ditolak', 'Laporan sudah pernah dilaporkan sebelumnya dan sedang dalam proses perbaikan.');

-- Sample data for reviews  
INSERT INTO `reviews` (`laporan_id`, `user_id`, `rating`, `komentar`) VALUES
(1, 1, 5, 'Sangat puas dengan penanganan laporan. Jembatan sudah diperbaiki dengan baik.'),
(2, 2, 4, 'Taman sudah bersih, namun masih perlu perawatan rutin.'),
(3, 3, 2, 'Kecewa karena laporan ditolak padahal masalah masih ada.');

SET FOREIGN_KEY_CHECKS = 1;