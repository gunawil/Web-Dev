import { useState, useRef } from "react";

function App() {
  let [groceryItems, setGroceryItems] = useState([
    { id: 1, name: 'Kopi Sachet', quantity: 2, checked: true },
    { id: 2, name: 'Gula Pasir', quantity: 5, checked: false },
    { id: 3, name: 'Air Mineral', quantity: 3, checked: false },
    { id: 4, name: 'Garam', quantity: 10, checked: false },
    { id: 5, name: 'Minyak Goreng', quantity: 1, checked: false },
  ]);

  return (
    <div className="app">
      <Header />
      
      <Form groceryItems={groceryItems} setGroceryItems={setGroceryItems}/>
      
      <ListItems groceryItems={groceryItems} setGroceryItems={setGroceryItems}/>
      
      <Action groceryItems={groceryItems} setGroceryItems={setGroceryItems}/>
      
      <Footer groceryItems={groceryItems} />
    </div>
  );
}

export default App;

function Header(){
  return (<h1>Shopping List 📝</h1>)
}

function Form({groceryItems, setGroceryItems}){
  let qtyRef = useRef();
  let itemRef = useRef();

  function handleAddButton(e){
    e.preventDefault();

    const qty = qtyRef.current.value.trim();
    const item = itemRef.current.value.trim();

    if (!qty || !item){
      alert('Silakan mengisi detail item dengan lengkap');
      return;
    }

    const newItem = {
      id : parseInt(groceryItems.length + 1),
      name: item,
      quantity: parseInt(qty),
      checked: false,
    }

    setGroceryItems([...groceryItems, newItem])

    alert('Item berhasil ditambahkan')

    qtyRef.current.value = '';
    itemRef.current.value='';
  }

  return (
    <form className="add-form" onSubmit={handleAddButton}>
        <h3>Hari ini belanja apa kita?</h3>
        <div>
          <input type="text" placeholder="0" className="input-list" onKeyPress={(event) => {
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                      event.preventDefault();
                                                                    }}} ref={qtyRef}/>
          <input type="text" placeholder="nama barang..." ref={itemRef}/>
        </div>
        <button>Tambah</button>
      </form>
  )
}

function ListItems({groceryItems, setGroceryItems}){
  function handleCheckboxChange(id){
    const updatedItems = groceryItems.map((item) => 
      item.id === id ? {...item, checked: !item.checked}: item
    );

    setGroceryItems(updatedItems);
  }

  function handleButtonDelete(id){
    const updatedItems = groceryItems.filter((item) => item.id !== id);

    setGroceryItems(updatedItems);
  }
  
  return (<div className="list">
          <ul>
            {groceryItems.map((item) => (
              <li key={item.id}>
              <input type="checkbox" checked={item.checked} onChange={()=> handleCheckboxChange(item.id)}/>
              <span style={{textDecoration: item.checked ? 'line-through' : ''}}>{item.quantity} {item.name}</span>
              <button onClick={()=>handleButtonDelete(item.id)}>&times;</button>
            </li>
            ))}
          </ul>
        </div>)
}

function Action({groceryItems, setGroceryItems}){
  function handleSort(sortBy){
    let sortedItem = [];
    if (sortBy === "alphabet"){
      sortedItem = [...groceryItems].sort((a,b) => a.name.localeCompare(b.name));
    }else if (sortBy === "completed"){
      sortedItem = [...groceryItems].sort((a, b) => b.checked - a.checked);
    }else if (sortBy === "inputOrder"){
      sortedItem = [...groceryItems].sort((a, b) => a.id - b.id);
    }

    setGroceryItems(sortedItem);
  }

  function clearList(){
    setGroceryItems([]);
  }

  return (
    <div className="actions">
      <select onChange={(e) => handleSort(e.target.value)}>
        <option value="inputOrder">Urutkan berdasarkan urutan input</option>
        <option value="alphabet">Urutkan berdasarkan nama barang</option>
        <option value="completed">Urutkan berdasarkan ceklis</option>
      </select>
      <button onClick={clearList}>Bersihkan Daftar</button>
    </div>
  )
}

function Footer({groceryItems}){
  const totalItem = groceryItems.length;
  const completedItem = groceryItems.filter((item) => item.checked === true).length;
  const percentageCompleted = totalItem === 0 ? 0 : ((completedItem / totalItem) * 100).toFixed(2);

  return (
    <footer className="stats">Ada {totalItem} barang di daftar belanjaan, {completedItem} barang sudah dibeli ({percentageCompleted}%)</footer>
  )
}