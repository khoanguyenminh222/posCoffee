const baseURL = 'http://localhost:10000' || 'https://api-pos-coffee.vercel.app';
const categoriesRoutes = '/api/categories';
//get all
//get by id /:id
//category post /id, put /id, delete /id
const drinksGetByCategory = '/api/drinks/category';
const drinksRoutes = '/api/drinks';
//get all
//get by id /:id
//get by category /category/:idcategory
//drink post /:id, put /:id, delete /:id
const billRoutes = '/api/bills'; 
//get all
//post /:id, put /:id, delete /:id
//get bill id: /api/bills/:billid
//get bill by user /api/bills/user/:userid
const userRoutes = '/api/users';
const weekScheduleRoutes = '/api/weekSchedule';
const reportRoutes = '/api/report';
const historyRoutes = '/api/history';
const ingredientRoutes = '/api/ingredient';
export {baseURL, categoriesRoutes, drinksGetByCategory, drinksRoutes, billRoutes, userRoutes, weekScheduleRoutes, reportRoutes, historyRoutes, ingredientRoutes}