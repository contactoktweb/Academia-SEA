"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, ArrowRight, Printer, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitPlacementTest } from "./actions";
import { toast } from "sonner";
import Link from "next/link";
import { Shield } from "lucide-react";
import Image from "next/image";

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

export default function PlacementTestPage() {
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
    window.scrollTo(0, 0);
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
      window.scrollTo(0, 0);
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
      level = "A1 (Beginner)";
      description = "Tienes conocimientos muy básicos o nulos. Te recomendamos iniciar desde el nivel introductorio.";
    } else if (percentage < 45) {
      level = "A2 (Elementary)";
      description = "Comprendes frases aisladas y expresiones de uso frecuente. Puedes comunicarte en tareas sencillas.";
    } else if (percentage < 70) {
      level = "B1 (Intermediate)";
      description = "Eres capaz de entender los puntos principales de textos claros. Puedes desenvolverte en la mayor parte de situaciones de viaje.";
    } else if (percentage < 85) {
      level = "B2 (Upper Intermediate)";
      description = "Entiendes ideas complejas y textos abstractos. Puedes relacionarte con hablantes nativos con suficiente fluidez.";
    } else {
      level = "C1 (Advanced)";
      description = "Comprendes una amplia variedad de textos extensos y exigentes. Utilizas el lenguaje de forma flexible y efectiva.";
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
      window.scrollTo(0, 0);
    });
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sea-blue shadow-lg">
                <Shield className="size-8 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Placement Test</h1>
            <p className="text-slate-500">Examen de ubicación - Academia SEA</p>
          </div>
          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo *</label>
              <Input
                required
                placeholder="Ej. Juan Pérez"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Edad / Categoría *</label>
              <Select required onValueChange={(v) => setUserData({ ...userData, ageCategory: v })}>
                <SelectTrigger>
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="juan@ejemplo.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono (WhatsApp)</label>
              <Input
                type="tel"
                placeholder="Opcional"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Sede de Interés *</label>
              <Select required onValueChange={(v) => setUserData({ ...userData, sede: v })}>
                <SelectTrigger>
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
            <Button type="submit" className="w-full h-12 text-base font-bold mt-2">
              Comenzar Examen
            </Button>
          </form>
          <p className="mt-6 text-xs text-center text-slate-400 italic">
            Basado en el Marco Común Europeo de Referencia (MCER)
          </p>
        </div>
      </div>
    );
  }

  if (step === "test") {
    const section = EXAM_DATA.sections[currentSection];
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-sm font-bold text-sea-blue uppercase tracking-widest">
                Sección {currentSection + 1} de {EXAM_DATA.sections.length}
              </h2>
              <h1 className="text-3xl font-bold text-slate-900">{section.title}</h1>
            </div>
            <div className="text-slate-500 font-medium whitespace-nowrap">
              Progreso: {Math.round((currentSection / EXAM_DATA.sections.length) * 100)}%
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
            <div className="flex items-start gap-3 bg-sea-blue/5 p-4 rounded-xl border-l-4 border-sea-blue mb-8">
              <Info className="size-5 text-sea-blue mt-0.5 flex-shrink-0" />
              <p className="text-slate-700 font-medium">{section.instructions}</p>
            </div>

            {section.text && (
              <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed italic">
                {section.text.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-10">
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                  <p className="text-lg font-semibold text-slate-800 mb-5">
                    {qIdx + 1}. {q.q}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[`${section.id}_${qIdx}`] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(section.id, qIdx, oIdx)}
                          className={`p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${
                            isSelected
                              ? "border-sea-blue bg-sea-blue/5 text-sea-blue font-bold shadow-sm"
                              : "border-slate-100 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold uppercase transition-colors ${
                              isSelected ? "bg-sea-blue text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {String.fromCharCode(97 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={nextSection}
            disabled={isPending}
            className="w-full h-14 rounded-xl text-lg font-bold shadow-lg"
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
      </div>
    );
  }

  if (step === "result" && result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-sea-blue p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
              <Shield className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <h1 className="text-xl font-medium opacity-90 mb-2">Resultado para: {userData.name}</h1>
              <div className="text-6xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-md">
                {result.level.split(" ")[0]}
              </div>
              <div className="text-xl md:text-2xl font-bold bg-white/20 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
                {result.level}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 tracking-wider">Aciertos</div>
                <div className="text-3xl font-black text-slate-800">
                  {result.score} <span className="text-lg text-slate-400 font-medium">/ {result.totalQuestions}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2 tracking-wider">Porcentaje</div>
                <div className="text-3xl font-black text-slate-800">{Math.round(result.percentage)}%</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center text-lg">
                <CheckCircle className="text-sea-blue mr-2 h-6 w-6" />
                Diagnóstico Sugerido:
              </h3>
              <p className="text-slate-700 leading-relaxed bg-sea-blue/5 p-5 rounded-2xl italic border border-sea-blue/10">
                "{result.description}"
              </p>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-8">
              <h3 className="font-bold text-slate-800 text-lg">Tus próximos pasos en SEA:</h3>
              <p className="text-slate-600">
                Tus resultados han sido enviados a nuestro equipo académico. Muy pronto nos pondremos en contacto contigo para completar tu proceso de admisión e inscribirte en el grupo ideal para ti.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 h-12 rounded-xl text-slate-600 font-bold border-2"
              >
                <Printer className="mr-2 h-4 w-4" /> Imprimir Reporte
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Realizar otro examen
              </Button>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sea-blue hover:underline font-medium text-sm">
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
