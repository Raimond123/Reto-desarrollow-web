using Microsoft.EntityFrameworkCore;
using reto_api.Models;
using reto_api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrar servicios
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// Registrar servicio de limpieza automática de tokens
builder.Services.AddHostedService<TokenCleanupService>();

// Configurar CORS para permitir conexiones desde el frontend y página externa
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
    
    // Política más permisiva para endpoints públicos de tokens
    options.AddPolicy("AllowPublicAccess", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configurar logging para tokens
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar CORS antes de autorización
app.UseCors("AllowPublicAccess");

app.UseAuthorization();

app.MapControllers();

app.Run();
