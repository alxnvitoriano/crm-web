import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface OrganizationInvitationEmailProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

const TeamInvitationEmail = (props: OrganizationInvitationEmailProps) => {
  const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } = props;

  return (
    <Html lang="pt-BR" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Você foi convidado(a) para participar da equipe {teamName}</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Você foi convidado(a) para a equipe {teamName}
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                {invitedByUsername} te convidou para colaborar
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">Olá!</Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                <strong>{invitedByUsername}</strong> ({invitedByEmail}) convidou você para
                participar da equipe <strong>{teamName}</strong>.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[24px]">
                Clique no botão abaixo para aceitar o convite e começar a colaborar com sua equipe.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={inviteLink}
                className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Aceitar Convite
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                Se o botão não funcionar, você pode copiar e colar este link no seu navegador:
              </Text>
              <Link href={inviteLink} className="text-blue-600 text-[14px] break-all underline">
                {inviteLink}
              </Link>
            </Section>

            {/* Additional Info */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                <strong>O que acontece depois?</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[4px]">
                • Você terá acesso aos projetos e recursos da equipe
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[4px]">
                • Poderá colaborar com os membros da equipe em tempo real
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                • Receberá notificações sobre as atividades da equipe
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                Este convite foi enviado para {email}. Se você não estava esperando este convite,
                pode ignorar este e-mail com segurança.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © {new Date().getFullYear()} Plataforma de Colaboração. Todos os direitos
                reservados.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                Av. Paulista, 1000, Conjunto 101, São Paulo, SP, 01310-100
              </Text>
              <Link href="#" className="text-[12px] text-gray-500 underline">
                Cancelar inscrição
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TeamInvitationEmail;
