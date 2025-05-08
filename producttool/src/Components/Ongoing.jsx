import React from 'react';

const OngoingProducts = ({ products }) => {
  const handleClick = (product) => {
    alert(`Clicked on ${product.name}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">Ongoing</h2>

      {/* If there are no products */}
      {products.length === 0 ? (
        <p className="!text-2xl text-gray-500">No Ongoing Products</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex flex-nowrap space-x-6 pb-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleClick(product)}
                className={`shrink-0 w-36 h-36 ${product.color} rounded-2xl shadow-xl flex items-center justify-center text-xl font-semibold text-gray-800 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition duration-300 ease-in-out`}
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default OngoingProducts;
