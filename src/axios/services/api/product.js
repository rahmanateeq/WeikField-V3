import request from "../../shared/lib/request";

function getProduct() {
	return request({
		url: "/products",
		method: "GET",
	});
}

function getProductDetails(item) {
	return request({
		url: `/products/${item.id}`,
		method: "GET",
	});
}

function addOrder(data) {
	return request({
		url: `/products`,
		method: "POST",
		body: JSON.stringify({
			title: "test product",
			price: 13.5,
			description: "lorem ipsum set",
			image: "https://i.pravatar.cc",
			category: "electronic",
		}),
	});
}

const ProductService = {

	getProduct,
	getProductDetails,
	addOrder, 
};

export default ProductService;
