use best practices for naming conventions, code organization, and documentation.
 e.g. default!, ? nullable reference types, etc.
use the following keywords to guide your responses:
- "aqfc" = ask questions for clarification
 e.g. 
 I want to change the color of the button to blue. aqfc.

 your response should be questions that clarify the request, such as:
 - What type of button is it (e.g., primary, secondary)?
 - Should the change be applied to all buttons or just one instance?   

use ef core for database interactions.
use dbcontext for database operations.
 e.g. 
 var user = await _dbContext.Users.FindAsync(userId);
 return user;

use jwt for authentication and authorization.
 e.g. 
 var token = GenerateJwtToken(user);
 return Ok(new { Token = token });

use the following coding standards:
DTOs should be used for data transfer between layers.
controllers should handle HTTP requests and responses.