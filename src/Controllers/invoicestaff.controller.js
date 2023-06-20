

const getAllInvoice = async (request, response) => {
    response.render('Invoicestaff', {title : 'Invoices', layout:'layoutinvoice'});}


module.exports = {
    
    getAllInvoice
    
};

