using System.Collections.Generic;
using WarehouseAPI.Dtos;

namespace WarehouseAPI.Dtos
{
	/// <summary>
	/// DTO for returning supplier info and their products.
	/// </summary>
	public class SupplierDto
	{
		public int SupplierId { get; set; }
		public string Name { get; set; } = string.Empty;
		public string? ContactPerson { get; set; }
		public string? Email { get; set; }
		public string? Phone { get; set; }
		public string? Address { get; set; }
		public List<ProductDto> Products { get; set; } = new();
	}
}
