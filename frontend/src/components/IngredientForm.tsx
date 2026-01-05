import { useState } from 'react';

interface IngredientFormProps {
    onAdd: (name: string) => void;
}

export function IngredientForm({
    onAdd,
}: IngredientFormProps) {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
        if (error) setError(null);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = name.trim();

        if (!trimmed) {
            setError('Please enter a name.');
            return;
        }

        onAdd(trimmed);
        setName('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label>New Ingredient: </label>
                <input
                    id="ingredient-name"
                    type="text"
                    value={name}
                    onChange={handleChange}
                />
                <button type="submit" >Add</button>
            </div>
            {error && (
                <div id="ingredient-name-error" role="alert" style={{ color: 'tomato' }}>
                    {error}
                </div>
            )}
        </form>
    );
}
