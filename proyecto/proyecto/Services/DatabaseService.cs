using proyecto.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

namespace proyecto.Services
{
    public class DatabaseService
    {
        private string connectionString = "server=localhost;port=3306;database=ProyectoFCT;user=root;password=root;";


        public List<Empresa> GetEmpresas()
        {
            List<Empresa> empresas = new List<Empresa>();
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT * FROM Empresas";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        empresas.Add(new Empresa
                        {
                            Id = reader.GetInt32("Id"),
                            Nombre = reader.GetString("Nombre"),
                            Direccion = reader.IsDBNull(2) ? "" : reader.GetString("Direccion"),
                            Poblacion = reader.IsDBNull(3) ? "" : reader.GetString("Ciudad"),
                            
                            Observaciones = reader.IsDBNull(4) ? "" : reader.GetString("Observaciones")
                        });
                    }
                }
            }
            return empresas;
        }

        public void InsertEmpresa(Empresa empresa)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string query = "INSERT INTO Empresas (Nombre, Direccion, Ciudad, Observaciones) VALUES (@nombre, @direccion, @ciudad, @observaciones)";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@nombre", empresa.Nombre);
                    cmd.Parameters.AddWithValue("@direccion", empresa.Direccion);
                    cmd.Parameters.AddWithValue("@ciudad", empresa.Poblacion);
                    cmd.Parameters.AddWithValue("@observaciones", empresa.Observaciones);
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public void DeleteEmpresa(int id)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM Empresas WHERE Id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateEmpresa(Empresa empresa)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string query = "UPDATE Empresas SET Nombre = @nombre, Direccion = @direccion, Ciudad = @ciudad, Observaciones = @observaciones WHERE Id = @id";
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", empresa.Id);
                    cmd.Parameters.AddWithValue("@nombre", empresa.Nombre);
                    cmd.Parameters.AddWithValue("@direccion", empresa.Direccion);
                    cmd.Parameters.AddWithValue("@ciudad", empresa.Poblacion);
                    cmd.Parameters.AddWithValue("@observaciones", empresa.Observaciones);
                    cmd.ExecuteNonQuery();
                }
            }
        }






    }
}
