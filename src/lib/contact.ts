const emailJsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
const emailJsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "";
const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";

const whatsappNumberRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
const whatsappNumberDigits = whatsappNumberRaw.replace(/\D/g, "");

export const publicContactConfig = {
  emailJs: {
    serviceId: emailJsServiceId,
    templateId: emailJsTemplateId,
    publicKey: emailJsPublicKey,
  },
  whatsappNumberRaw,
  whatsappNumberDigits,
};

export function hasEmailJsConfig() {
  return Boolean(
    publicContactConfig.emailJs.serviceId &&
      publicContactConfig.emailJs.templateId &&
      publicContactConfig.emailJs.publicKey
  );
}

export function getWhatsAppHref(message = "Hola, quiero recibir mas informacion sobre PreventiGen.") {
  if (!publicContactConfig.whatsappNumberDigits) {
    return null;
  }

  const query = new URLSearchParams({ text: message });
  return `https://wa.me/${publicContactConfig.whatsappNumberDigits}?${query.toString()}`;
}
