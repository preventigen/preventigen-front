"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/src/components/ui/Container";
import { Badge } from "@/src/components/magic/ui/badge";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";
import { Button } from "@/src/components/magic/ui/button";
import { Input } from "@/src/components/magic/ui/input";
import { Label } from "@/src/components/magic/ui/label";
import {
  getPasswordRuleState,
  validateEmail,
  validatePassword,
  validateRequired,
  validateSpecialty,
} from "@/src/utils/validations";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
type Mode = "login" | "register";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  name: string;
  specialty: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginData, string>>;
type RegisterErrors = Partial<Record<keyof RegisterData, string>>;
type LoginTouched = Partial<Record<keyof LoginData, boolean>>;
type RegisterTouched = Partial<Record<keyof RegisterData, boolean>>;

const loginInitial: LoginData = {
  email: "",
  password: "",
};

const registerInitial: RegisterData = {
  email: "",
  name: "",
  specialty: "",
  password: "",
};

const panelTransition = {
  duration: 0.28,
  ease: "easeOut" as const,
};



function getInputStateClass(hasError: boolean, isValid: boolean) {
  if (hasError) {
    return "border-rose-400/70 focus-visible:border-rose-500 focus-visible:ring-rose-200";
  }
  if (isValid) {
    return "border-emerald-400/70 focus-visible:border-emerald-500 focus-visible:ring-emerald-200";
  }
  return "";
}

function InlineFieldMessage({
  id,
  error,
  success,
  hint,
}: {
  id: string;
  error?: string;
  success?: string;
  hint: string;
}) {
  return (

    
    <div id={id} aria-live="polite" className="mt-1 min-h-[24px]">
      <AnimatePresence mode="wait" initial={false}>
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-700"
          >
            <CircleAlert className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        ) : success ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
          >
            <CircleCheck className="h-3.5 w-3.5" />
            {success}
          </motion.p>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Info className="h-3.5 w-3.5" />
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PasswordRequirements({ value }: { value: string }) {
  const rules = getPasswordRuleState(value);

  const items = [
    { ok: rules.minLength, label: "Minimo 8 caracteres" },
    { ok: rules.hasUppercase, label: "Al menos 1 mayuscula" },
    { ok: rules.hasNumber, label: "Al menos 1 numero" },
    { ok: rules.hasSpecial, label: "Al menos 1 caracter especial" },
  ];

  return (
    <ul className="mt-2 grid gap-1">
      {items.map((item) => (
        <li
          key={item.label}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs transition",
            item.ok ? "text-emerald-700" : "text-muted-foreground"
          )}
        >
          <CircleCheck
            className={cn("h-3.5 w-3.5", item.ok ? "opacity-100" : "opacity-40")}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function validateLoginData(data: LoginData): LoginErrors {
  return {
    email: validateEmail(data.email),
    password: validatePassword(data.password),
  };
}

function validateRegisterData(data: RegisterData): RegisterErrors {
  return {
    email: validateEmail(data.email),
    name: validateRequired(data.name, "El nombre"),
    specialty: validateSpecialty(data.specialty),
    password: validatePassword(data.password),
  };
}

export function CredentialsView() {
  const [mode, setMode] = useState<Mode>("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>(loginInitial);
  const [registerData, setRegisterData] = useState<RegisterData>(registerInitial);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [loginTouched, setLoginTouched] = useState<LoginTouched>({});
  const [registerTouched, setRegisterTouched] = useState<RegisterTouched>({});
  const [feedback, setFeedback] = useState<string>("");
  const router = useRouter()
  const loginEmailError = loginTouched.email ? loginErrors.email : undefined;
  const loginPasswordError = loginTouched.password ? loginErrors.password : undefined;
  const registerEmailError = registerTouched.email ? registerErrors.email : undefined;
  const registerNameError = registerTouched.name ? registerErrors.name : undefined;
  const registerSpecialtyError = registerTouched.specialty ? registerErrors.specialty : undefined;
  const registerPasswordError = registerTouched.password ? registerErrors.password : undefined;

  const loginEmailValid = Boolean(
    loginTouched.email && loginData.email.trim() && !loginEmailError
  );
  const loginPasswordValid = Boolean(
    loginTouched.password && loginData.password.trim() && !loginPasswordError
  );
  const registerEmailValid = Boolean(
    registerTouched.email && registerData.email.trim() && !registerEmailError
  );
  const registerNameValid = Boolean(
    registerTouched.name && registerData.name.trim() && !registerNameError
  );
  const registerSpecialtyValid = Boolean(
    registerTouched.specialty && registerData.specialty.trim() && !registerSpecialtyError
  );
  const registerPasswordValid = Boolean(
    registerTouched.password && registerData.password.trim() && !registerPasswordError
  );

  function updateLoginField<K extends keyof LoginData>(field: K, value: LoginData[K]) {
    const nextData = { ...loginData, [field]: value };
    setLoginData(nextData);
    setLoginTouched((prev) => ({ ...prev, [field]: true }));
    setLoginErrors(validateLoginData(nextData));
  }

  function updateRegisterField<K extends keyof RegisterData>(
    field: K,
    value: RegisterData[K]
  ) {
    const nextData = { ...registerData, [field]: value };
    setRegisterData(nextData);
    setRegisterTouched((prev) => ({ ...prev, [field]: true }));
    setRegisterErrors(validateRegisterData(nextData));
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setLoginErrors({});
    setRegisterErrors({});
    setLoginTouched({});
    setRegisterTouched({});
    setFeedback("");
  }

  async function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginTouched({ email: true, password: true });
    const nextErrors = validateLoginData(loginData);
    setLoginErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setFeedback("Corrige los errores del formulario para continuar.");
      return;
    }
    const res = signIn("credentials", {
    email: loginData.email,
    password: loginData.password,
    redirect: false,
  })

  if ((await res)?.error) {
    setFeedback("Credenciales inválidas.")
    return
  }

  router.push("/")
    
  }

  function onRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterTouched({
      email: true,
      name: true,
      specialty: true,
      password: true,
    });
    const nextErrors = validateRegisterData(registerData);
    setRegisterErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setFeedback("Corrige los errores del formulario para continuar.");
      return;
    }

    setFeedback("Formulario de registro valido. Listo para conectar a tu API.");
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-heading py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.24),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(31,111,235,0.28),transparent_35%),linear-gradient(to_bottom,rgba(11,31,59,0.95),rgba(11,31,59,1))]" />

      <Container className="relative">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <BlurFade className="lg:col-span-5" delay={0.04}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 transition hover:bg-white/15 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            <div className="mt-6 rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/65">
                Acceso PreventiGen
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Gestiona tu cuenta clinica
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Inicia sesion o registrate para continuar con una experiencia coherente con el resto
                de la plataforma.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Acceso protegido
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                  <Stethoscope className="mr-1.5 h-3.5 w-3.5" />
                  Perfil medico
                </Badge>
              </div>
            </div>
          </BlurFade>

          <BlurFade className="lg:col-span-7" delay={0.08}>
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface p-6 shadow-sm sm:p-8">
              <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {mode === "login" ? "Login" : "Registro"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-heading">
                  {mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Ingresa con tu email y contrasena."
                    : "Completa tus datos para registrarte."}
                </p>

                <div className="mt-6">
                  <AnimatePresence mode="wait" initial={false}>
                    {mode === "login" ? (
                      <motion.form
                        key="login"
                        onSubmit={onLoginSubmit}
                        noValidate
                        initial={{ opacity: 0, x: 22, filter: "blur(6px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -22, filter: "blur(6px)" }}
                        transition={panelTransition}
                        className="grid gap-5"
                      >
                        <div>
                          <Label htmlFor="login-email" className="text-heading">
                            Email
                          </Label>
                          <InlineFieldMessage
                            id="login-email-msg"
                            hint="Usa tu email profesional."
                            error={loginEmailError}
                            success={loginEmailValid ? "Email valido" : undefined}
                          />
                          <div className="relative mt-2">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="text"
                              inputMode="email"
                              autoComplete="email"
                              placeholder="tu@email.com"
                              className={cn(
                                "pl-9",
                                getInputStateClass(Boolean(loginEmailError), loginEmailValid)
                              )}
                              aria-invalid={Boolean(loginEmailError)}
                              aria-describedby="login-email-msg"
                              value={loginData.email}
                              onChange={(event) => updateLoginField("email", event.target.value)}
                              onBlur={() =>
                                setLoginTouched((prev) => ({ ...prev, email: true }))
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="login-password" className="text-heading">
                            Contrasena
                          </Label>
                          <InlineFieldMessage
                            id="login-password-msg"
                            hint="Debe incluir mayuscula, numero y caracter especial."
                            error={loginPasswordError}
                            success={loginPasswordValid ? "Contrasena valida" : undefined}
                          />
                          <div className="relative mt-2">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type={showLoginPassword ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="Tu contrasena"
                              className={cn(
                                "pl-9 pr-11",
                                getInputStateClass(
                                  Boolean(loginPasswordError),
                                  loginPasswordValid
                                )
                              )}
                              aria-invalid={Boolean(loginPasswordError)}
                              aria-describedby="login-password-msg"
                              value={loginData.password}
                              onChange={(event) =>
                                updateLoginField("password", event.target.value)
                              }
                              onBlur={() =>
                                setLoginTouched((prev) => ({ ...prev, password: true }))
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-heading"
                              aria-label={
                                showLoginPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                              }
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button type="submit" className="mt-1 h-10">
                          Iniciar sesion
                        </Button>

                        <p className="text-sm text-muted-foreground">
                          No tienes contrasena?{" "}
                          <button
                            type="button"
                            onClick={() => switchMode("register")}
                            className="font-medium text-primary underline-offset-4 transition hover:underline"
                          >
                            Registrate aqui
                          </button>
                        </p>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="register"
                        onSubmit={onRegisterSubmit}
                        noValidate
                        initial={{ opacity: 0, x: 22, filter: "blur(6px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -22, filter: "blur(6px)" }}
                        transition={panelTransition}
                        className="grid gap-5"
                      >
                        <div>
                          <Label htmlFor="register-email" className="text-heading">
                            Email
                          </Label>
                          <InlineFieldMessage
                            id="register-email-msg"
                            hint="Usa un email activo para acceder."
                            error={registerEmailError}
                            success={registerEmailValid ? "Email valido" : undefined}
                          />
                          <div className="relative mt-2">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="register-email"
                              type="text"
                              inputMode="email"
                              autoComplete="email"
                              placeholder="tu@email.com"
                              className={cn(
                                "pl-9",
                                getInputStateClass(Boolean(registerEmailError), registerEmailValid)
                              )}
                              aria-invalid={Boolean(registerEmailError)}
                              aria-describedby="register-email-msg"
                              value={registerData.email}
                              onChange={(event) =>
                                updateRegisterField("email", event.target.value)
                              }
                              onBlur={() =>
                                setRegisterTouched((prev) => ({ ...prev, email: true }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="register-name" className="text-heading">
                              Nombre
                            </Label>
                            <InlineFieldMessage
                              id="register-name-msg"
                              hint="Como deseas que figure en tu perfil."
                              error={registerNameError}
                              success={registerNameValid ? "Nombre valido" : undefined}
                            />
                            <div className="relative mt-2">
                              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="register-name"
                                placeholder="Tu nombre"
                                className={cn(
                                  "pl-9",
                                  getInputStateClass(Boolean(registerNameError), registerNameValid)
                                )}
                                aria-invalid={Boolean(registerNameError)}
                                aria-describedby="register-name-msg"
                                value={registerData.name}
                                onChange={(event) =>
                                  updateRegisterField("name", event.target.value)
                                }
                                onBlur={() =>
                                  setRegisterTouched((prev) => ({ ...prev, name: true }))
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="register-specialty" className="text-heading">
                              Especialidad
                            </Label>
                            <InlineFieldMessage
                              id="register-specialty-msg"
                              hint="Minimo 4 caracteres."
                              error={registerSpecialtyError}
                              success={registerSpecialtyValid ? "Especialidad valida" : undefined}
                            />
                            <div className="relative mt-2">
                              <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="register-specialty"
                                placeholder="Ej: Clinica medica"
                                className={cn(
                                  "pl-9",
                                  getInputStateClass(
                                    Boolean(registerSpecialtyError),
                                    registerSpecialtyValid
                                  )
                                )}
                                aria-invalid={Boolean(registerSpecialtyError)}
                                aria-describedby="register-specialty-msg"
                                value={registerData.specialty}
                                onChange={(event) =>
                                  updateRegisterField("specialty", event.target.value)
                                }
                                onBlur={() =>
                                  setRegisterTouched((prev) => ({
                                    ...prev,
                                    specialty: true,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="register-password" className="text-heading">
                            Contrasena
                          </Label>
                          <InlineFieldMessage
                            id="register-password-msg"
                            hint="Te ayudamos a crear una contrasena segura."
                            error={registerPasswordError}
                            success={registerPasswordValid ? "Contrasena valida" : undefined}
                          />
                          <div className="relative mt-2">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="register-password"
                              type={showRegisterPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Crea una contrasena"
                              className={cn(
                                "pl-9 pr-11",
                                getInputStateClass(
                                  Boolean(registerPasswordError),
                                  registerPasswordValid
                                )
                              )}
                              aria-invalid={Boolean(registerPasswordError)}
                              aria-describedby="register-password-msg"
                              value={registerData.password}
                              onChange={(event) =>
                                updateRegisterField("password", event.target.value)
                              }
                              onBlur={() =>
                                setRegisterTouched((prev) => ({ ...prev, password: true }))
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-heading"
                              aria-label={
                                showRegisterPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                              }
                            >
                              {showRegisterPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <PasswordRequirements value={registerData.password} />
                        </div>

                        <Button type="submit" className="mt-1 h-10">
                          Crear cuenta
                        </Button>

                        <p className="text-sm text-muted-foreground">
                          Ya estas registrado?{" "}
                          <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className="font-medium text-primary underline-offset-4 transition hover:underline"
                          >
                            Click aqui para login
                          </button>
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {feedback ? (
                  <p className="mt-5 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
                    {feedback}
                  </p>
                ) : null}
              </div>
            </div>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
