import { Container, Group, Text, Title } from "@mantine/core";
import classes from "./footer.module.css";
import { Link } from "react-router-dom";
import telegramIcon from "../../assets/img/telegram.svg";

const links = [
  { link: "/", label: "Asosiy" },
  { link: "/wells", label: "Quduqlar" },
];

export default function Footer() {
  const items = links.map((link) => (
    <Link key={link.label} to={link.link}>
      <Text td="none" c="dimmed" size="sm">
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <Container size={"xl"} className={classes.footer}>
      <div className={classes.inner}>
        <Title size="md" c="dimmed">
          Sirdaryo Melio suv qurilish MCHJ © 2024{" "}
          <a
            href="https://t.me/ocean68x"
            traget="_blank"
            className={classes.link}
          >
            <img src={telegramIcon} /> Xudayorov
          </a>
          <a
            href="https://t.me/yokub_janovich"
            traget="_blank"
            className={classes.link}
          >
            <img src={telegramIcon} /> Yuldashev
          </a>
        </Title>
        <Title size="md" c="dimmed" m={"lg"}>
          Namangan viloyati, Namangan tumani, Sho‘rqo‘rg‘on MFY Bog‘bon ko‘chasi
          2-uy.
        </Title>
        <Group className={classes.links}>{items}</Group>
      </div>
    </Container>
  );
}
