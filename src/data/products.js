export const products = [
  { id: 1, name: 'Tênis Nike Revolution 6 Next Nature Masculino', image: 'https://picsum.photos/id/10/292/321', price: 219.90, priceDiscount: 149.90, category: 'Tênis' },
  { id: 2, name: 'Camiseta Básica Algodão', image: 'https://picsum.photos/id/20/292/321', price: 89.90, category: 'Camisetas' },
  { id: 3, name: 'Calça Jeans Slim', image: 'https://picsum.photos/id/30/292/321', price: 159.90, priceDiscount: 129.90, category: 'Calças' },
  { id: 4, name: 'Boné Trucker Preto', image: 'https://picsum.photos/id/40/292/321', price: 69.90, category: 'Bonés' },
  { id: 5, name: 'Headphone Bluetooth', image: 'https://picsum.photos/id/50/292/321', price: 299.90, priceDiscount: 249.90, category: 'Headphones' },
  { id: 6, name: 'Tênis Casual Branco', image: 'https://picsum.photos/id/60/292/321', price: 189.90, category: 'Tênis' },
  { id: 7, name: 'Moletom Capuz', image: 'https://picsum.photos/id/70/292/321', price: 179.90, priceDiscount: 149.90, category: 'Moletons' },
  { id: 8, name: 'Shorts Esportivo', image: 'https://picsum.photos/id/80/292/321', price: 79.90, category: 'Shorts' },
];

export const getProductById = (id) => products.find(p => p.id === Number(id));
