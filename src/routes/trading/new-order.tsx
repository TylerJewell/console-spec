import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@heroui/button";
import { FormInput, FormSelect } from "@/components/Form";
import { pushToast } from "@/components/Toast";
import { useCreateOrder } from "@/hooks/useTradingData";
import type { OrderType, Market } from "@/types/trading";

export const Route = createFileRoute("/trading/new-order")({
  component: NewOrderPage,
});

interface FormErrors {
  price?: string[];
  quantity?: string[];
}

function NewOrderPage() {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [type, setType] = useState<OrderType>("buy");
  const [market, setMarket] = useState<Market>("spot");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const priceNum = parseFloat(price);
    const qtyNum = parseFloat(quantity);

    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = ["Price must be a positive number."];
    }
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.quantity = ["Quantity must be a positive number."];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createOrder.mutateAsync({
        type,
        market,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      });

      pushToast("Order created successfully", {
        description: `${type} ${quantity} MWh at $${parseFloat(price).toFixed(2)}/MWh on ${market.replace("_", " ")} market`,
        variant: "success",
      });

      navigate({ to: "/trading/orders" });
    } catch {
      pushToast("Failed to create order", { variant: "error" });
    }
  }

  return (
    <div className="max-w-lg">
      <h3 className="text-medium font-[550] dark:font-[500] mb-4">Create New Order</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          id="order-type"
          label="Order Type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as OrderType)}
          options={[
            { value: "buy", label: "Buy" },
            { value: "sell", label: "Sell" },
          ]}
        />

        <FormSelect
          id="order-market"
          label="Market"
          required
          value={market}
          onChange={(e) => setMarket(e.target.value as Market)}
          options={[
            { value: "spot", label: "Spot" },
            { value: "day_ahead", label: "Day Ahead" },
          ]}
        />

        <FormInput
          id="order-price"
          label="Price ($/MWh)"
          required
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g. 45.50"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          errors={errors.price}
        />

        <FormInput
          id="order-quantity"
          label="Quantity (MWh)"
          required
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g. 100"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          errors={errors.quantity}
        />

        <div className="pt-2">
          <Button
            type="submit"
            color="primary"
            isLoading={createOrder.isPending}
          >
            Submit Order
          </Button>
        </div>
      </form>
    </div>
  );
}
