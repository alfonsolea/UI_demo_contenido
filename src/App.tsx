import React, { useState } from 'react';
import ContentForm from './components/ContentForm';

function App() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    console.log('Form data submitted:', data);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetch('https://hook.us1.make.com/3awludyn1w1aubxrbcafshw8srdx633i', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
        if (typeof result.generatedContent === 'string') {
          setGeneratedContent(result.generatedContent);
        } else {
          setGeneratedContent(JSON.stringify(result));
        }
      } else {
        result = await response.text();
        setGeneratedContent(result);
      }

      console.log('Response from server:', result);
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Generador de Contenido AI para Redes Sociales</h1>
        <ContentForm onSubmit={handleSubmit} />
        {error && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-red-600">Error:</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <p>{error}</p>
            </div>
          </div>
        )}
        {generatedContent && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Contenido Generado:</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              <p>{generatedContent}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;