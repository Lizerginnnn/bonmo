import { Backdrop } from "@/components/backdrop/backdrop";
import { Registration } from "@/components/registration/registration";
import { Card } from "@/design-system/card/card";
import "./page.css";

export default function Home() {
  return (
    <>
      <Backdrop />
      <main className="page">
        <Card>
          <Registration />
        </Card>
      </main>
    </>
  );
}
