import { useState } from 'react';
import type { Ingredient } from '../types';

interface IngredientListProps {
    items: Ingredient[];
    onDelete: (id: string) => void;
    onEdit: (id: string, name: string) => void;
}

export function IngredientList({ items, onDelete, onEdit }: IngredientListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>('');

    function startEdit(ing: Ingredient) {
        setEditingId(ing.id);
        setEditName(ing.name);
    }
    function cancelEdit() {
        setEditingId(null);
        setEditName('');
    }
    function saveEdit() {
        const trimmed = editName.trim();
        if (!trimmed) return;
        onEdit(editingId!, trimmed);
        setEditingId(null);
        setEditName('');
    }
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') cancelEdit();
    }

    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <section>
            <h2 id="ingredients-heading">Ingredients</h2>
            {sorted.length === 0 ? (
                <p style={{ color: '#888' }}>No ingredients yet. Add your first one above.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {sorted.map(ing => (
                        <li key={ing.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {editingId === ing.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoFocus={true}
                                    />
                                    <button type="button" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
                                    <button type="button" onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span style={{ flex: 1 }}>{ing.name}</span>
                                    <button type="button" onClick={() => startEdit(ing)}>Edit</button>
                                    <button type="button" onClick={() => onDelete(ing.id)} aria-label={`Delete ${ing.name}`}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
