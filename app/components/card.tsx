type CardProps = {
  title: string;
  description: string;
  link: string;
  icon: string;
};

export function Card({ title, description, link, icon }: CardProps) {
  return (
    <a
      href={link}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
    >
      <div className="flex items-center mb-4">
        <div className="text-4xl mr-4">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}
