export const metadata = {
  title: "Contacts | UaRP Blog",
  description: "Get in touch with the UaRP Blog team.",
};

export default function ContactsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contacts</h1>
      <p className="mb-4">We’d love to hear from you! 💬</p>
      <ul className="space-y-2">
        <li>
          📧 Email:{" "}
          <a
            href="mailto:info@uarp.blog"
            className="text-blue-600 hover:underline"
          >
            info@uarp.blog
          </a>
        </li>
        <li>
          💼 LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/viktor-svertoka/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Viktor Svertoka
          </a>
        </li>
        <li>
          🧑‍💻 GitHub:{" "}
          <a
            href="https://github.com/ViktorSvertoka"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            @ViktorSvertoka
          </a>
        </li>
      </ul>
    </main>
  );
}
