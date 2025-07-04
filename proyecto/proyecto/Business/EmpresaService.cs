using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using proyecto.Models;
using proyecto.Services;
using System.Threading.Tasks;

namespace proyecto.Business
{
    class EmpresaService
    {
        private DatabaseService dbService = new DatabaseService();

        public List<Empresa> GetEmpresas()
        {
            return dbService.GetEmpresas();
        }

        public void AddEmpresa(Empresa empresa)
        {
            dbService.InsertEmpresa(empresa);
        }

        public void RemoveEmpresa(int id)
        {
            dbService.DeleteEmpresa(id);
        }
        public void UpdateEmpresa(Empresa empresa)
        {
            dbService.UpdateEmpresa(empresa);
        }


    }
}
