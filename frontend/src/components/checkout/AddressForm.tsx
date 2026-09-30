"use client";

import { Input } from "@/components/ui/Input";
import { ShippingAddress } from "@/types/order";

export function AddressForm({
  value,
  onChange,
}: {
  value: ShippingAddress;
  onChange: (v: ShippingAddress) => void;
}) {
  const set = (key: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Full name" value={value.fullName} onChange={set("fullName")} />
        <Input placeholder="Phone" value={value.phone} onChange={set("phone")} />
      </div>
      <Input placeholder="Street address" value={value.street} onChange={set("street")} />
      <div className="grid grid-cols-3 gap-3">
        <Input placeholder="City" value={value.city} onChange={set("city")} />
        <Input placeholder="State" value={value.state} onChange={set("state")} />
        <Input placeholder="Postal code" value={value.postalCode} onChange={set("postalCode")} />
      </div>
      <Input placeholder="Country" value={value.country} onChange={set("country")} />
    </div>
  );
}
