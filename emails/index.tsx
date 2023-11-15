import { Button } from "@react-email/button";
import { Text } from "@react-email/text";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Container } from "@react-email/container";
import * as React from "react";
import { Preview, Section } from "@react-email/components";
import { Link } from "@react-email/link";

type EmailProps = {
  url: string;
};

const LoginEmail: React.FunctionComponent<EmailProps> = ({ url = "example" }) => {
  return (
    <Tailwind>
      <Html>
        <Preview>Inicia sesión en Amaranto</Preview>
        <Container className="bg-fuchsia-200 text-center font-sans">
          <Section>
            <Text className="text-2xl font-bold">
              Iniciá sesión en Amaranto
            </Text>
          </Section>
          <Section className="pb-6">
            <Text>Usa el siguiente enlace para iniciar sesión</Text>
            <Button
              href={url}
              className="rounded-lg bg-fuchsia-700 px-4 py-2 text-xl text-white"
            >
              Iniciá sesión
            </Button>
          </Section>

          <Section className="text-white bg-black">
            <Text className="font-thin font-sm">
              <Link href="https://chirotech.dev">ChiroTech</Link> - 2023
            </Text>
          </Section>
        </Container>
      </Html>
    </Tailwind>
  );
};

export default LoginEmail;
