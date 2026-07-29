"use client";

import { useState, useTransition } from "react";
import { Info, ArrowRight, Printer, RefreshCw, CheckCircle, Loader2, Sparkles, User, Mail, Phone, MapPin, GraduationCap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitPlacementTest } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

const EXAM_DATA = {
  sections: [
    {
      id: "grammar_a1_a2",
      title: "Part 1: Use of English (A1-A2)",
      instructions: "Choose the correct option to complete the sentences.",
      questions: [
        { q: "Hello, what ___ your name?", options: ["is", "are", "am", "be"], correct: 0 },
        { q: "They ___ from Spain, they are from Mexico.", options: ["not are", "aren't", "don't be", "isn't"], correct: 1 },
        { q: "Look! That is ___ car over there.", options: ["me", "my", "mine", "I"], correct: 1 },
        { q: "I usually ___ to work by bus.", options: ["goes", "going", "go", "gone"], correct: 2 },
        { q: "Yesterday, we ___ a very expensive restaurant.", options: ["visit", "visited", "visiting", "visits"], correct: 1 },
        { q: "___ you ever been to London?", options: ["Do", "Are", "Have", "Did"], correct: 2 },
        { q: "There ___ some milk in the fridge.", options: ["is", "are", "any", "be"], correct: 0 },
        { q: "She is ___ than her sister.", options: ["tall", "taller", "the tallest", "more tall"], correct: 1 },
        { q: "I can't talk now. I ___ my dinner.", options: ["eat", "eating", "eats", "am eating"], correct: 3 },
        { q: "Where ___ you last night?", options: ["was", "were", "did", "are"], correct: 1 },
      ],
    },
    {
      id: "grammar_b1_b2",
      title: "Part 2: Intermediate Usage (B1-B2)",
      instructions: "Select the most appropriate grammatical structure.",
      questions: [
        { q: "If I ___ more time, I would learn how to play the piano.", options: ["have", "had", "will have", "would have"], correct: 1 },
        { q: "The bridge ___ built in 1920.", options: ["was", "is", "were", "has been"], correct: 0 },
        { q: "I don't mind ___ early in the morning.", options: ["to wake up", "wake up", "waking up", "woke up"], correct: 2 },
        { q: "You ___ smoke here; it's strictly prohibited.", options: ["don't have to", "mustn't", "needn't", "couldn't"], correct: 1 },
        { q: "By this time next year, I ___ my degree.", options: ["will finish", "finish", "will have finished", "finished"], correct: 2 },
        { q: "He's the man ___ daughter won the prize.", options: ["who", "which", "whose", "whom"], correct: 2 },
        { q: "I wish I ___ so much cake earlier.", options: ["didn't eat", "haven't eaten", "hadn't eaten", "don't eat"], correct: 2 },
        { q: "She suggested ___ to the cinema.", options: ["going", "to go", "go", "to going"], correct: 0 },
        { q: "Hardly ___ I entered the room when the phone rang.", options: ["did", "have", "had", "was"], correct: 2 },
        { q: "I am used to ___ in a big city.", options: ["live", "living", "lives", "lived"], correct: 1 },
      ],
    },
    {
      id: "reading",
      title: "Part 3: Reading Comprehension",
      instructions: "Read the text and answer the questions.",
      text: "Modern technology has changed the way we communicate. In the past, people wrote letters or used landline telephones. Today, social media and instant messaging allow us to talk to anyone in the world instantly. However, some experts argue that this has made our relationships more superficial. While we have more 'friends' online, we may have fewer deep connections in real life.",
      questions: [
        { q: "What is the main topic of the text?", options: ["The history of telephones", "How technology affects communication", "How to use social media", "The cost of technology"], correct: 1 },
        { q: "According to the text, what is a possible negative effect of modern communication?", options: ["It is too expensive", "It is very slow", "Relationships might become superficial", "Letters are better than emails"], correct: 2 },
        { q: "What does 'instantly' mean in this context?", options: ["Slowly", "Rarely", "Immediately", "Once a year"], correct: 2 },
      ],
    },
    {
      id: "listening",
      title: "Part 4: Listening Comprehension (Script-based)",
      instructions: "Read the following dialogue and answer the questions as if you were listening to it.",
      text: "Receptionist: Good morning, Apex Solutions. How can I help you?\nCaller: Hello, I'd like to speak to Mr. Henderson in the marketing department, please.\nReceptionist: I'm afraid Mr. Henderson is in a meeting until 2 PM. Would you like to leave a message?\nCaller: Yes, please. This is Sarah Jenkins from Global Tech. Tell him the contract is ready for review.",
      questions: [
        { q: "Who does the caller want to speak to?", options: ["Sarah Jenkins", "Mr. Henderson", "The Receptionist", "Global Tech CEO"], correct: 1 },
        { q: "Why is the person unavailable?", options: ["He is on holiday", "He is sick", "He is in a meeting", "He left the company"], correct: 2 },
        { q: "What is the message about?", options: ["A job interview", "A marketing plan", "A contract review", "A new telephone line"], correct: 2 },
      ],
    },
  ],
};

export function PlacementTestForm() {
  const [step, setStep] = useState<"welcome" | "test" | "result">("welcome");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userData, setUserData] = useState({
    name: "",
    ageCategory: "",
    email: "",
    phone: "",
    sede: "",
  });
  const [result, setResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name || !userData.ageCategory || !userData.sede) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }
    setStep("test");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnswer = (sectionId: string, questionIdx: number, optionIdx: number) => {
    setAnswers({
      ...answers,
      [`${sectionId}_${questionIdx}`]: optionIdx,
    });
  };

  const nextSection = () => {
    if (currentSection < EXAM_DATA.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let score = 0;
    let totalQuestions = 0;

    EXAM_DATA.sections.forEach((section) => {
      section.questions.forEach((q, idx) => {
        totalQuestions++;
        if (answers[`${section.id}_${idx}`] === q.correct) {
          score++;
        }
      });
    });

    const percentage = (score / totalQuestions) * 100;
    let level = "A1";
    let description = "";

    if (percentage < 20) {
      level = "A1 (Principiante)";
      description = "Tienes conocimientos muy básicos o nulos. Te recomendamos iniciar desde el nivel introductorio.";
    } else if (percentage < 45) {
      level = "A2 (Elemental)";
      description = "Comprendes frases aisladas y expresiones de uso frecuente. Puedes comunicarte en tareas sencillas y cotidianas.";
    } else if (percentage < 70) {
      level = "B1 (Intermedio)";
      description = "Eres capaz de entender los puntos principales de textos claros. Puedes desenvolverte en la mayor parte de situaciones cotidianas y laborales.";
    } else if (percentage < 85) {
      level = "B2 (Intermedio Alto)";
      description = "Entiendes ideas complejas y textos abstractos. Puedes relacionarte con hablantes nativos con fluidez y espontaneidad.";
    } else {
      level = "C1 (Avanzado)";
      description = "Comprendes una amplia variedad de textos extensos y exigentes. Utilizas el lenguaje de forma flexible, fluida y efectiva.";
    }

    const testResult = { score, totalQuestions, level, description, percentage };
    setResult(testResult);

    // Save to database
    startTransition(async () => {
      const res = await submitPlacementTest({
        ...userData,
        ...testResult,
      });

      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Examen finalizado y guardado con éxito.");
      }
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (step === "welcome") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-sea-blue to-sea-blue-light p-8 md:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Examen Gratuito
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Comienza tu Evaluación</h2>
              <p className="mt-2 text-sm md:text-base text-white/90 max-w-lg mx-auto">
                Ingresa tus datos a continuación para iniciar la prueba. Te llevará solo unos minutos.
              </p>
            </div>
          </div>

          <form onSubmit={handleStart} className="p-6 md:p-10 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-sea-blue" />
                  Nombre Completo <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ej. Juan Pérez"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="h-12 rounded-xl border-slate-200 focus:border-sea-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-sea-blue" />
                    Edad / Categoría <span className="text-rose-500">*</span>
                  </label>
                  <Select required onValueChange={(v) => setUserData({ ...userData, ageCategory: v })}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Niño (6-12)">Niño (6-12 años)</SelectItem>
                      <SelectItem value="Adolescente (13-17)">Adolescente (13-17 años)</SelectItem>
                      <SelectItem value="Joven (18-25)">Joven (18-25 años)</SelectItem>
                      <SelectItem value="Adulto (26+)">Adulto (26+ años)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-sea-blue" />
                    Sede de Interés <span className="text-rose-500">*</span>
                  </label>
                  <Select required onValueChange={(v) => setUserData({ ...userData, sede: v })}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEAGRULLO">SEA El Grullo</SelectItem>
                      <SelectItem value="SEAAUTLAN">SEA Autlán</SelectItem>
                      <SelectItem value="SEAUNION">SEA Unión de Tula</SelectItem>
                      <SelectItem value="EN_LINEA">SEA En Línea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 focus:border-sea-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    Teléfono / WhatsApp
                  </label>
                  <Input
                    type="tel"
                    placeholder="Ej. 321 123 4567"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 focus:border-sea-blue"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-base font-bold bg-sea-blue hover:bg-sea-blue-light text-white shadow-lg shadow-sea-blue/20 transition-all hover:scale-[1.01]">
              Comenzar Examen <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-center text-xs text-slate-400 italic">
              Basado en los estándares oficiales del Marco Común Europeo de Referencia (MCER).
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (step === "test") {
    const section = EXAM_DATA.sections[currentSection];
    const progressPercent = Math.round(((currentSection + 1) / EXAM_DATA.sections.length) * 100);

    return (
      <div className="mx-auto max-w-3xl animate-in fade-in duration-500">
        {/* Progress Bar & Header */}
        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-extrabold text-sea-blue uppercase tracking-widest">
                Sección {currentSection + 1} de {EXAM_DATA.sections.length}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{section.title}</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-sea-blue/10 px-3 py-1 text-xs font-bold text-sea-blue self-start sm:self-center">
              {progressPercent}% Completado
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-sea-blue transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Section Content */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-lg shadow-slate-200/40 mb-8">
          <div className="flex items-start gap-3 bg-sea-blue/5 p-4 rounded-2xl border-l-4 border-sea-blue mb-8">
            <Info className="h-5 w-5 text-sea-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm md:text-base text-slate-700 font-medium">{section.instructions}</p>
          </div>

          {section.text && (
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed italic text-sm md:text-base">
              {section.text.split("\n").map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {section.questions.map((q, qIdx) => (
              <div key={qIdx} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-start gap-2">
                  <span className="text-sea-blue">{qIdx + 1}.</span> {q.q}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[`${section.id}_${qIdx}`] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleAnswer(section.id, qIdx, oIdx)}
                        className={`p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? "border-sea-blue bg-sea-blue/5 text-sea-blue font-bold shadow-md shadow-sea-blue/10 scale-[1.01]"
                            : "border-slate-200/80 hover:border-sea-blue/40 bg-white text-slate-700 hover:bg-slate-50/80"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold uppercase transition-colors ${
                            isSelected ? "bg-sea-blue text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm md:text-base font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={nextSection}
          disabled={isPending}
          className="w-full h-14 rounded-2xl text-base md:text-lg font-bold bg-sea-blue hover:bg-sea-blue-light text-white shadow-xl shadow-sea-blue/20 transition-all hover:scale-[1.01]"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : currentSection === EXAM_DATA.sections.length - 1 ? (
            "Finalizar y Ver Resultados"
          ) : (
            "Siguiente Sección"
          )}
          {!isPending && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    );
  }

  if (step === "result" && result) {
    return (
      <div className="mx-auto max-w-2xl animate-in zoom-in-95 duration-500">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/50">
          <div className="bg-gradient-to-r from-sea-blue via-sea-blue-light to-sea-blue p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
              <GraduationCap className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-2">
                Resultado de Diagnóstico
              </span>
              <h2 className="text-lg font-medium text-white/90">Aspirante: {userData.name}</h2>
              <div className="text-5xl md:text-7xl font-black my-4 tracking-tight drop-shadow-md">
                {result.level.split(" ")[0]}
              </div>
              <div className="text-lg md:text-xl font-bold bg-white/20 inline-block px-6 py-2 rounded-full backdrop-blur-md">
                {result.level}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200/60">
                <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider block mb-1">Aciertos</span>
                <span className="text-2xl md:text-3xl font-black text-slate-800">
                  {result.score} <span className="text-sm md:text-base text-slate-400 font-normal">/ {result.totalQuestions}</span>
                </span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200/60">
                <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider block mb-1">Porcentaje</span>
                <span className="text-2xl md:text-3xl font-black text-sea-blue">{Math.round(result.percentage)}%</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-base md:text-lg">
                <CheckCircle className="text-sea-blue mr-2 h-5 w-5" />
                Diagnóstico Sugerido:
              </h3>
              <p className="text-slate-700 leading-relaxed bg-sea-blue/5 p-5 rounded-2xl italic border border-sea-blue/15 text-sm md:text-base">
                "{result.description}"
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6 mb-8">
              <h3 className="font-bold text-slate-800 text-base md:text-lg">Tus próximos pasos en SEA:</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Tus resultados han sido registrados exitosamente. Nuestro equipo académico se comunicará contigo para brindarte información detallada sobre horarios, inscripciones y el plan de estudios correspondiente a tu nivel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 h-12 rounded-xl text-slate-700 font-bold border-2 border-slate-200 hover:bg-slate-50"
              >
                <Printer className="mr-2 h-4 w-4" /> Imprimir Reporte
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Realizar Otro Examen
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sea-blue hover:underline font-bold text-sm">
                Volver a la página principal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
