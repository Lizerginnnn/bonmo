import { payment } from "@/config/registration";
import { Text } from "@/design-system/text/text";
import "./payment-info.css";

export function PaymentInfo() {
  return (
    <section className="payment-info">
      <Text variant="title">Оплата встречи</Text>
      <Text>
        Для записи на встречу оплатите билет по номеру
        <br />
        <Text as="span" weight="medium">
          {payment.phone}
        </Text>{" "}
        {payment.recipient}
      </Text>
      <Text>
        Стоимость встречи — {payment.price}
        <br />
        <Text as="span" accent>
          Первая встреча для новых участников клуба — {payment.firstMeetingPrice}
        </Text>
      </Text>
    </section>
  );
}
