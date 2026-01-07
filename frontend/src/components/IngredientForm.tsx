import { useState } from 'react';

interface IngredientFormProps {
    onAdd: (name: string) => void;
}

export function IngredientForm({
    onAdd,
}: IngredientFormProps) {
    const [name, setName] = useState<string>('');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const trimmed = name.trim();
        if (!trimmed) return;
        onAdd(trimmed);

        setName('');
    }

    const canSubmit = name.trim().length > 0;

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{minWidth: 'fit-content'}}>New ingredient: </label>
                <input
                    id="ingredient-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button type="submit" disabled={!canSubmit}>Add</button>
            </div>
        </form>
    );
}
