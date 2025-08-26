using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;
using WarehouseAPI.Dtos;
using WarehouseAPI.Dtos.Products;

namespace WarehouseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ProductsController(WarehouseContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .AsNoTracking()
                .Include(p => p.Supplier)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Sku = p.Sku,
                    Name = p.Name,
                    Category = p.Category,
                    QuantityOnHand = p.QuantityOnHand,
                    ReorderLevel = p.ReorderLevel,
                    SupplierId = p.SupplierId,
                    Location = p.Location,
                    Supplier = p.Supplier != null
                        ? new SupplierSummaryDto
                        {
                            SupplierId = p.Supplier.SupplierId,
                            Name = p.Supplier.Name
                        }
                        : null
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .AsNoTracking()
                .Include(p => p.Supplier)
                .Where(p => p.ProductId == id)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Sku = p.Sku,
                    Name = p.Name,
                    Category = p.Category,
                    QuantityOnHand = p.QuantityOnHand,
                    ReorderLevel = p.ReorderLevel,
                    SupplierId = p.SupplierId,
                    Location = p.Location,
                    Supplier = p.Supplier != null
                        ? new SupplierSummaryDto
                        {
                            SupplierId = p.Supplier.SupplierId,
                            Name = p.Supplier.Name
                        }
                        : null
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Products/reorder-alerts
        [HttpGet("reorder-alerts")]
        public async Task<ActionResult<IEnumerable<ReorderAlertDto>>> GetReorderAlerts()
        {
            var reorderAlerts = await _context.Database
                .SqlQueryRaw<ReorderAlertDto>(@"
                    SELECT 
                        product_id as ProductId,
                        sku as Sku,
                        name as Name,
                        quantity_on_hand as QuantityOnHand,
                        reorder_level as ReorderLevel,
                        (reorder_level - quantity_on_hand) as ShortageAmount
                    FROM vw_ReorderAlerts
                ")
                .ToListAsync();

            return Ok(reorderAlerts);
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
