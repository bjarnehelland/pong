export function User({ user }) {
  return (
    <div className="flex place-items-center gap-4 m-2">
      <img
        className="inline object-cover w-16 h-16 rounded-full"
        src={user.image}
      />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
