import { redirect } from "next/navigation";
import { PRODUCT_SLUG } from "@/lib/slug";

export default function ProdutoIndexPage() {
  redirect(`/produto/${PRODUCT_SLUG}`);
}
