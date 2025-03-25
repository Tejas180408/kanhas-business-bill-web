import { useState } from "react";
import domtoimage from "dom-to-image";

const BillGenerator = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    selectedProducts: [],
    products: {},
    discount: "",
    month: "",
  });

  const availableProducts = [
    "Milk (L)",
    "Ghee (Kg)",
    "Goat Male",
    "Goat Female",
    "Sheep Male",
    "Sheep Female",
  ];

  const handleProductSelection = (product) => {
    setFormData((prev) => {
      const isSelected = prev.selectedProducts.includes(product);
      return {
        ...prev,
        selectedProducts: isSelected
          ? prev.selectedProducts.filter((p) => p !== product)
          : [...prev.selectedProducts, product],
        products: isSelected
          ? { ...prev.products, [product]: undefined }
          : { ...prev.products, [product]: { quantity: "", price: "" } },
      };
    });
  };

  const handleChange = (e, product) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      products: {
        ...prev.products,
        [product]: { ...prev.products[product], [name]: value },
      },
    }));
  };

  const generatePDF = () => {
    const billElement = document.getElementById("bill-preview");

    if (!billElement) {
      console.error("Bill preview not found!");
      return;
    }

    // Ensure all fonts are loaded before capturing
    document.fonts.ready.then(() => {
      domtoimage
        .toJpeg(billElement, {
          quality: 1.0, // Highest quality
          bgcolor: "#fff", // Ensures background color is not transparent
        })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "bill.jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error capturing bill:", error);
        });
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-6">
      <div className="m-4 p-6 w-[80%] lg:w-1/3 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Kanhas Milk & Goat Farm</h2>
        <h2 className="text-xl font-bold mb-4">Generate Bill</h2>
        <form className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            name="date"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />

          <h3 className="font-bold mt-4">Bill Of Month</h3>
          <select
            name="month"
            value={formData.month || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, month: e.target.value }))
            }
            className="p-2 border rounded w-full"
          >
            <option value="" disabled>
              Select Month
            </option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <h3 className="font-bold mt-4">Select Products</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableProducts.map((product) => (
              <label key={product} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.selectedProducts.includes(product)}
                  onChange={() => handleProductSelection(product)}
                />
                <span>{product}</span>
              </label>
            ))}
          </div>

          <h3 className="font-bold mt-4">Enter Product Details</h3>
          {formData.selectedProducts.map((product) => (
            <>
              <div key={product} className="grid grid-cols-3 gap-2">
                <label className="col-span-3">{product}</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  min="1"
                  onChange={(e) => handleChange(e, product)}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  min="1"
                  onChange={(e) => handleChange(e, product)}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </>
          ))}

          <h3 className="font-bold mt-5">Discount (%)</h3>
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            min="0"
            max="100"
            value={formData.discount} // Ensure it's controlled
            onChange={(e) => {
              let value = e.target.value;
              value = Math.min(Math.max(value, 0), 100); // Ensure between 0-100
              setFormData((prev) => ({ ...prev, discount: value }));
            }}
            className="p-2 border rounded w-57"
          />
        </form>
        <button
          type="button"
          onClick={generatePDF}
          className="cursor-pointer w-full mt-10 bg-blue-500 text-white p-2 mt-4 rounded"
        >
          Download Bill
        </button>
      </div>
      <div className="m-6 w-[80%] lg:w-1/3">
        {/* Bill Preview */}
        <div
          id="bill-preview"
          style={{ backgroundColor: "#ffffff" }}
          className="px-14 py-8 min-w-[794px] min-h-[1123px] rounded shadow"
        >
          <div className="flex items-center justify-between">
            <img src="src/assets/kanhas_milk_logo.png" className="w-24" />
            <span>
              <h2 className="text-[27px] font-extrabold text-center mt-4">
                KANHA'S MILK & GOAT FARM
              </h2>
              <h2 className=" text-center mt-0.5 text-sm font-medium">
                C/O: Natraj Residency C-8, Chavan Nagar, Dhankawadi,
              </h2>
              <h2 className="text-center text-sm font-medium">Pune, 411043</h2>
              <h2 className="text-center text-sm font-medium">
                Mobile : 7038097938
              </h2>
              <h2 className="text-center text-sm font-medium">
                Email : kanhasmilk@gmail.com
              </h2>
            </span>
            <img src="src/assets/kanhas_goat_logo.png" className="w-20" />
          </div>

          <hr className="mt-3 mb-3" />

          <span
            className="p-2 mb-3 flex justify-between "
            style={{ backgroundColor: "rgb(209, 213, 219)" }}
          >
            <p className="w-54">
              <strong>Invoice Date :</strong> {formData.date}
            </p>
            <p className="w-48">
              <strong> Bill of Month : </strong> {formData.month}
            </p>
          </span>

          <p className="pb-2">
            <h3 className="font-semibold">BILL TO</h3>
            <strong className="text-lg">{formData.name}</strong>
          </p>

          {formData.selectedProducts.length > 0 && (
            <table
              className="w-full mt-2 "
              style={{
                borderCollapse: "collapse",
                borderBottom: "1px solid #ccc",
                borderTop: "2px solid #000",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e5e7eb" }}>
                  <th
                    style={{
                      borderBottom: "2px solid black",
                      padding: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid black",
                      padding: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid black",
                      padding: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    Price (₹)
                  </th>
                  <th
                    style={{
                      borderBottom: "2px solid black",
                      padding: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    Total (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.selectedProducts.map((product) => {
                  const quantity = formData.products[product]?.quantity || 0;
                  const price = formData.products[product]?.price || 0;
                  const total = quantity * price;
                  return (
                    <tr
                      className="text-center"
                      key={product}
                      style={{ backgroundColor: "#e5e7eb" }}
                    >
                      <td
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {product}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {quantity}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {price}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Total Price */}
          <h3
            className="text-right font-bold py-2.5"
            style={{
              borderCollapse: "collapse",
              borderBottom: "2px solid #000",
              borderTop: "2px solid #000",
            }}
          >
            Total Amount : ₹
            {formData.selectedProducts.reduce((acc, product) => {
              const quantity = formData.products[product]?.quantity || 0;
              const price = formData.products[product]?.price || 0;
              const discountAmount =
                ((acc + quantity * price) * (formData.discount || 0)) / 100;
              return acc + quantity * price - discountAmount;
            }, 0)}
          </h3>

          {formData.discount > 0 && (
            <h3 className="text-right font-bold mt-4 mb-4">
              Discount : {formData.discount || 0}%
            </h3>
          )}
        </div>
        <footer
          style={{
            borderTop: "1px solid #ccc",
            position: "relative",
            bottom: 30,
            left: 19,
            backgroundColor: "#fff",
            padding: 2,
          }}
          className="flex justify-between"
        >
          <span className="font-semibold text-sm">Customer Care : <span className="font-normal">+91 9689203696</span></span>
          <span className="flex gap-1 items-center">
            <img src="/src/assets/instagram.png" className="w-5" />
            <p className="text-sm">kanhas_milk</p>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default BillGenerator;
