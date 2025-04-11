using Microsoft.AspNetCore.Mvc;
using CafeApp.Data;
using CafeApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Razor.Language.Intermediate;
using System.Text.RegularExpressions;
using System.Runtime.CompilerServices;

namespace CafeApp.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CafesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CafesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: AllCafes
        [HttpGet(Name = "GetAllCafes")]
        public async Task<ActionResult<IEnumerable<Cafe>>> GetAllCafes()
        {
            return await _context.Cafes.ToListAsync();
        }

        // GET: CafeById 
        [HttpGet(Name = "GetCafeById")]
        public async Task<ActionResult<Cafe>> GetCafeById(string id)
        {
            if (id == null) { return BadRequest(); }

            var cafe = await _context.Cafes.FindAsync(id);

            if (cafe == null) { return NotFound(); }

            return Ok(cafe);
        }

        // GET: Cafes and Num of Employees By Location
        [HttpGet(Name = "GetCafeWithNumEmployeesByLocation")]
        public async Task<ActionResult<CafeWithNumEmployeesDTO>> GetCafeWithNumEmployeesByLocation(string? location)
        {
            
            var query_cafeEmployments = await(from c in _context.Cafes.Where(c => c.Location == (String.IsNullOrEmpty(location) ? c.Location : location))
                                        join em in _context.Employments.Where(e => e.EndDate == null) 
                                        on c.Id equals em.CafeId into employmentGroup
                                        from em in employmentGroup.DefaultIfEmpty()
                                        group em by new { c.Id, c.Name, c.Description, c.Location }
                                        into grouped
                                        select new CafeWithNumEmployeesDTO
                                        {
                                            Id = grouped.Key.Id,
                                            Name = grouped.Key.Name,
                                            Description = grouped.Key.Description,
                                            Location = grouped.Key.Location,
                                            NumEmployees = grouped.Count(e => e != null)
                                        })
                                        .OrderByDescending(x => x.NumEmployees).ToListAsync();

            return Ok(query_cafeEmployments);
        }

        // GET: AllEmployees
        [HttpGet(Name = "GetAllEmployees")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        // GET: EmployeeById
        [HttpGet(Name = "GetEmployeeById")]
        public async Task<ActionResult<Employee>> GetEmployeeById(string id)
        {
            if (id == null) { return BadRequest(); }

            var employee = await _context.Employees.FindAsync(id);

            if(employee == null) { return NotFound(); }

            return Ok(employee);
        }

        // GET: Employees and Num of Days worked By Cafe
        [HttpGet(Name = "GetEmployeesWithNumDaysWorkedByCafe")]
        public async Task<ActionResult<EmployeeWithNumDaysWorked>> GetEmployeesWithNumDaysWorkedByCafe(string? cafeId)
        {
            if(String.IsNullOrEmpty(cafeId))
            {
                var query = FormattableStringFactory.Create(@"SELECT e.ID AS Id, e.NAME AS Name, 
                            e.EMAIL AS EMailAddress, e.PHONE AS PhoneNumber, e.GENDER AS Gender, 
                            IFNULL(DATEDIFF(NOW(), em.START_DATE), 0) AS NumDaysWorked, c.NAME AS Cafe
                            FROM Employees e
                            LEFT JOIN Employments em ON e.ID = em.EMPLOYEE_ID
                            LEFT JOIN Cafes c ON c.ID = em.CAFE_ID
                            ORDER BY DATEDIFF(NOW(), em.START_DATE) DESC");
                var result1 = await _context.Database.SqlQuery<EmployeeWithNumDaysWorked>(query).ToListAsync();

                return Ok(result1);
            }

            
            var query_employees = await (from em in _context.Employments
                                            where em.EndDate == null && (string.IsNullOrEmpty(cafeId) || em.CafeId == cafeId)
                                            join e in _context.Employees
                                            on em.EmployeeId equals e.Id into employeeGroup
                                            from e in employeeGroup.DefaultIfEmpty()

                                            join c in _context.Cafes
                                            on em.CafeId equals c.Id into cafesGroup
                                            from c in cafesGroup.DefaultIfEmpty()
                                            select new
                                            {
                                                Id = e.Id,
                                                Name = e.Name,
                                                EMailAddress = e.EMailAddress,
                                                PhoneNumber = e.PhoneNumber,
                                                Gender = e.Gender,
                                                StartDate = em.StartDate,
                                                CafeName = c.Name
                                            })
                                            .ToListAsync();

            var result = query_employees
                .Select(x => new EmployeeWithNumDaysWorked
                {
                    Id = x.Id,
                    Name = x.Name,
                    EMailAddress = x.EMailAddress,
                    PhoneNumber = x.PhoneNumber,
                    Gender = x.Gender,
                    NumDaysWorked = x.StartDate != null ? (int)(DateTime.Now - x.StartDate).TotalDays : 0,
                    Cafe = x.CafeName
                })
                .OrderByDescending(x => x.NumDaysWorked)
                .ToList();

            return Ok(result);
            

            
        }

        // POST: Cafes/Create/1
        [HttpPost(Name = "CreateCafe")]
        public async Task<ActionResult<Cafe>> CreateCafe([FromBody] Cafe cafe)
        {
            if(cafe == null) { return BadRequest(); }

            _context.Cafes.Add(cafe);
            await _context.SaveChangesAsync();

            //return Ok();

            return CreatedAtAction(nameof(GetCafeById), new { id = cafe.Id}, cafe);
        }

        // PUT: UpdateCafe
        [HttpPut(Name = "UpdateCafe")]
        public async Task<ActionResult<Cafe>> UpdateCafe(string id, [FromBody] Cafe updatedCafe)
        {
            var cafe = await _context.Cafes.FindAsync(id);

            if (cafe == null) { return NotFound(); }

            cafe.Name = updatedCafe.Name;
            cafe.Description = updatedCafe.Description;
            cafe.Location = updatedCafe.Location;

            await _context.SaveChangesAsync();
            return Ok(cafe);
        }

        // DELETE: Cafe (Delete cafe and all employees)
        [HttpDelete(Name = "DeleteCafe")]
        public async Task<ActionResult> DeleteCafe(string id)
        {
            var affectedRows = await _context.Cafes.Where(c => c.Id == id).ExecuteDeleteAsync();

            if(affectedRows == 0) {  return NotFound(); }

            return Ok();
        }

        // POST: CreateEmployee
        [HttpPost(Name = "CreateEmployee")]
        public async Task<ActionResult<Employee>> CreateEmployee([FromBody] Employee employee)
        {
            if(employee == null) { return BadRequest(); };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
        }

        // POST: CreateEmployeeForCafe
        [HttpPost(Name = "CreateEmployeeForCafe")]
        public async Task<ActionResult<Employee>> CreateEmployeeForCafe([FromBody] EmployeeWithCafeIdDTO employeeWithCafeId)
        {
            if(employeeWithCafeId == null) { return BadRequest(); }
            _context.Employees.Add(new Employee()
            {
                Id = employeeWithCafeId.Id,
                Name = employeeWithCafeId.Name,
                EMailAddress = employeeWithCafeId.EMailAddress,
                PhoneNumber = employeeWithCafeId.PhoneNumber,
                Gender = employeeWithCafeId.Gender
            });

            _context.Employments.Add(new Employment()
            {
                EmployeeId = employeeWithCafeId.Id,
                StartDate = DateTime.Now,
                EndDate = null,
                CafeId = employeeWithCafeId.CafeId
            });
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployeeById), new { id = employeeWithCafeId.Id }, employeeWithCafeId);
        }

        // PUT: UpdateEmployee
        [HttpPut(Name = "UpdateEmployee")]
        public async Task<ActionResult<Employee>> UpdateEmployee(string id, [FromBody] Employee updatedEmployee)
        {
            var employee = await _context.Employees.FindAsync(id);

            if(employee == null) { return NotFound(); };

            employee.Name = updatedEmployee.Name;
            employee.EMailAddress = updatedEmployee.EMailAddress;
            employee.PhoneNumber = updatedEmployee.PhoneNumber;
            employee.Gender = updatedEmployee.Gender;

            await _context.SaveChangesAsync();
            return Ok(employee);
        }

        // DELETE: Employee (Delete employee)
        [HttpDelete(Name = "DeleteEmployee")]
        public async Task<ActionResult> DeleteEmployee(string id)
        {
            var affectedRows = await _context.Employees.Where(c => c.Id == id).ExecuteDeleteAsync();

            if (affectedRows == 0) { return NotFound(); }

            return Ok();
        }


        // GET: EmploymentForEmployeeId
        [HttpGet(Name = "GetEmploymentForEmployeeId")]
        public async Task<ActionResult<IEnumerable<Employment>>> GetEmploymentForEmployeeId(string id)
        {
            return await _context.Employments.Where(e => e.EmployeeId == id).ToArrayAsync();
        }

        // GET: CurrentEmploymentForCafeId
        [HttpGet(Name = "GetCurrentEmploymentForCafeId")]
        public async Task<ActionResult<IEnumerable<Employment>>> GetCurrentEmploymentForCafeId(string id)
        {
            return await _context.Employments.Where(e => e.CafeId == id && e.EndDate == null).ToArrayAsync();
        }

        // POST: CreateEmployment
        [HttpGet(Name = "CreateEmployment")]
        public async Task<ActionResult<Employment>> CreateEmployment([FromBody] Employment employment)
        {
            if( employment == null ) { return BadRequest(); }

            //Override start date
            employment.StartDate = DateTime.Now;

            _context.Employments.Add(employment);
            await _context.SaveChangesAsync();

            return Ok(employment);
        }

        // PUT: UpdateCurrentEmploymentsEndDateByEmployeeId (Fire employee)
        [HttpPut(Name = "UpdateCurrentEmploymentsEndDateByEmployeeId")]
        public async Task<ActionResult<Employment>> UpdateCurrentEmploymentsEndDateByEmployeeId(string id)
        {
            var currentEmployment = _context.Employments.Where(e => e.EmployeeId == id && e.EndDate == null).FirstOrDefault();

            if (currentEmployment == null) { return NotFound(); }

            currentEmployment.EndDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(currentEmployment);
        }


        private bool CafeExists(string id)
        {
            return _context.Cafes.Any(e => e.Id == id);
        }
    }
}
