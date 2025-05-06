import React from "react";

const products = [
  { id: 1, name: "Product A", color: "bg-blue-200" },
  { id: 2, name: "Product B", color: "bg-green-200" },
  { id: 3, name: "Product C", color: "bg-pink-200" },
  { id: 4, name: "Product D", color: "bg-yellow-200" },
  { id: 5, name: "Product E", color: "bg-purple-200" },
  { id: 1, name: "Product A", color: "bg-blue-200" },
  { id: 2, name: "Product B", color: "bg-green-200" },
  { id: 3, name: "Product C", color: "bg-pink-200" },
  { id: 4, name: "Product D", color: "bg-yellow-200" },
  { id: 5, name: "Product E", color: "bg-purple-200" },
  { id: 1, name: "Product A", color: "bg-blue-200" },
  { id: 2, name: "Product B", color: "bg-green-200" },
  { id: 3, name: "Product C", color: "bg-pink-200" },
  { id: 4, name: "Product D", color: "bg-yellow-200" },
  { id: 5, name: "Product E", color: "bg-purple-200" },
];

const CompletedProducts = () => {
  const handleClick = (product) => {
    alert(`Clicked on ${product.name}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Launched Products</h2>
      {products.length === 0 ? (
        <p className="!text-2xl text-gray-500">No Launched Products</p>
      ) : (
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => handleClick(product)}
            className={`shrink-0 w-44 h-44 ${product.color} rounded-2xl shadow-xl flex items-center justify-center text-xl font-semibold text-gray-800 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition duration-300 ease-in-out`}
          >
            {product.name}
          </button>
        ))}
      </div>
      )}
    </div>
  );
};

export default CompletedProducts;
