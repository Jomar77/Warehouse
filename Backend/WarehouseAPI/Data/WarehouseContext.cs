using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;

namespace WarehouseAPI.Data
{
    public class WarehouseContext : DbContext
    {
        public WarehouseContext(DbContextOptions<WarehouseContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure constraints and relationships
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Sku)
                .IsUnique();

            modelBuilder.Entity<Purchase>()
                .HasIndex(p => p.PoNumber)
                .IsUnique();

            // Configure check constraints
            modelBuilder.Entity<User>()
                .ToTable(t => t.HasCheckConstraint("CK_users_role", "role IN ('admin', 'staff')"));

            modelBuilder.Entity<Purchase>()
                .ToTable(t => t.HasCheckConstraint("CK_purchases_status", "status IN ('Ordered', 'Received')"));

            modelBuilder.Entity<Order>()
                .ToTable(t => t.HasCheckConstraint("CK_orders_status", "status IN ('Pending', 'Shipped')"));
        }
    }
}