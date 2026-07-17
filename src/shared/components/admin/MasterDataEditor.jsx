import { useState } from 'react';
import { masterDataService } from '@/services/masterDataService';

export function MasterDataEditor({ type, title, items }) {
  const [name, setName] = useState('');
  const add = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    masterDataService.create(type, name);
    setName('');
  };

  return (
    <section className="admin-card">
      <h2>{title}</h2>
      <form className="master-add" onSubmit={add}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder={`Add ${title.toLowerCase()}`} />
        <button type="submit">Add</button>
      </form>
      <div className="master-list">
        {items.map((item) => (
          <div key={item.id} className={!item.active ? 'is-inactive' : ''}>
            <input
              value={item.name}
              aria-label={`${title} name`}
              onChange={(event) => masterDataService.update(type, item.id, { name: event.target.value })}
            />
            <button
              type="button"
              className={item.active ? 'deactivate' : 'activate'}
              onClick={() => masterDataService.update(type, item.id, { active: !item.active })}
            >
              {item.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
