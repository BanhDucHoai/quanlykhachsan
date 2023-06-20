

const getAllInvoice = async (request, response) => {

    response.render('Invoice', {title : 'Invoices', role:'admin'});}


module.exports = {
    
    getAllInvoice
    
};

