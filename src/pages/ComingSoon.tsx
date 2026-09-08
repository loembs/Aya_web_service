import { PageHeader, Card } from "../components";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title={title} subtitle="Cette fonctionnalité arrive bientôt" />
      <div className="flex flex-1 items-center justify-center px-7 py-5">
        <Card className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-aya-pink/10 font-display text-2xl font-bold text-aya-pink">
            A
          </div>
          <h2 className="font-display text-lg font-bold text-aya-ink">Bientôt disponible</h2>
          <p className="mt-2 text-sm leading-relaxed text-aya-text">
            {title} n’est pas encore ouvert. Nous préparons cette partie avec le même soin que le
            reste d’AYA. Revenez un peu plus tard.
          </p>
        </Card>
      </div>
    </div>
  );
}
