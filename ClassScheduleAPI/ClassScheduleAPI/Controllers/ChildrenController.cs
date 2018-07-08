using ClassScheduleAPI.Common;
using ClassScheduleAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClassScheduleAPI.Controllers
{
    public class ChildrenController : Controller
    {
        // GET: Children
        public ActionResult Index(string openID)
        {
            using (ClassScheduleDBEntities db = new ClassScheduleDBEntities())
            {
                var list = db.Children.Where(p => p.OpenID == openID).ToList();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Add(Children model)
        {
            using (ClassScheduleDBEntities db = new ClassScheduleDBEntities())
            {
                ResponseMessage msg = new ResponseMessage();
                try
                {
                    var entity = db.Children.Add(model);
                    db.SaveChanges();
                    msg.Status = true;
                }
                catch (Exception e)
                {
                    msg.Status = false;
                }
                return Json(msg);
            }
        }
        public ActionResult Update(Children model)
        {
            using (ClassScheduleDBEntities db = new ClassScheduleDBEntities())
            {
                ResponseMessage msg = new ResponseMessage();
                try
                {
                    var entity = db.Children.FirstOrDefault(p=>p.ID==model.ID);

                    db.SaveChanges();
                    msg.Status = true;
                }
                catch (Exception e)
                {
                    msg.Status = false;
                }
                return Json(msg);
            }
        }
    }
}