import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useAnonymization } from '@/hooks/useAnonymization.ts';
import { usePdfProcessing } from '@/hooks/usePdfProcessing.ts';
import { track } from '@/lib/analytics.ts';

// What the public pages' `DropZone` does with a file or the sample.
export function useDropZoneHandlers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFile, processFile, reset } = usePdfProcessing();
  const { setModel, setModelTokens, setNerEntities } = useAnonymization();

  const handleFileSelected = (file: File) => {
    setFile(file);
    navigate('/processing');
  };

  // The sample ships with precomputed entities, so it skips the model download and the NER step.
  const handleSampleSelected = async () => {
    try {
      const { fetchSample } = await import('@/lib/sample.ts');
      const { file, modelName, modelTokens, entities } = await fetchSample();
      setFile(file, true);
      await processFile(file);
      setModel(modelName);
      setModelTokens(modelTokens);
      setNerEntities(entities);
      track('sample-opened');
      navigate('/document/edition');
    } catch (err) {
      console.error(err);
      reset();
      toast.error(t('dropzone.sampleError'));
    }
  };

  return { handleFileSelected, handleSampleSelected };
}
