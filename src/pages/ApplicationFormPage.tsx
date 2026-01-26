import { Layout } from '@/components/layout/Layout';
import { BeamsBackground } from '@/components/effects/BeamsBackground';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const roleOptions = ['Producer', 'Beatmaker', 'Instrumentalist', 'Other'];

const toolOptions = [
  'Piano/MIDI Keyboard',
  'Guitar',
  'Bass',
  'Drums (live)',
  'Drums (programmed)',
  'Computer/DAW',
  'Other'
];

const experienceOptions = [
  '0-1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10-20 years',
  '20 years+'
];

const assistanceOptions = [
  'Mixing/Mastering',
  'Composition',
  'Branding',
  'Marketing',
  'Making physical products',
  'Other'
];

const ApplicationFormPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    genres: '',
    bio: '',
    role: '',
    tools: [] as string[],
    experience: '',
    assistance: [] as string[],
  });
  const [audioFiles, setAudioFiles] = useState<FileList | null>(null);

  const handleToolChange = (tool: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tools: checked 
        ? [...prev.tools, tool]
        : prev.tools.filter(t => t !== tool)
    }));
  };

  const handleAssistanceChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assistance: checked 
        ? [...prev.assistance, area]
        : prev.assistance.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.location || 
        !formData.genres || !formData.bio || !formData.role || formData.tools.length === 0 ||
        !formData.experience || formData.assistance.length === 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!audioFiles || audioFiles.length === 0) {
      toast({
        title: "Audio Files Required",
        description: "Please upload at least one audio file example of your work.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for applying. We'll review your application and contact you if interested.",
    });
    
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      genres: '',
      bio: '',
      role: '',
      tools: [],
      experience: '',
      assistance: [],
    });
    setAudioFiles(null);
  };

  return (
    <Layout>
      <BeamsBackground />
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <Send className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">Sample Society Application</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Personal Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Where are you based? <span className="text-destructive">*</span></Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country" 
                  required 
                />
              </div>
            </div>

            {/* Creative Profile */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Creative Profile</h2>
              
              <div className="space-y-2">
                <Label htmlFor="genres">What are your favorite genres to create? <span className="text-destructive">*</span></Label>
                <Input 
                  id="genres" 
                  value={formData.genres}
                  onChange={(e) => setFormData(prev => ({ ...prev, genres: e.target.value }))}
                  placeholder="Hip-hop, R&B, Soul, etc." 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tell us about yourself - give us a short bio of who you are as a creative <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Share your story, influences, and what drives your creativity..."
                  rows={5}
                  required 
                />
              </div>

              <div className="space-y-3">
                <Label>Are you a Producer, a Beatmaker, or an Instrumentalist? <span className="text-destructive">*</span></Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  {roleOptions.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <RadioGroupItem value={role} id={`role-${role}`} />
                      <Label htmlFor={`role-${role}`} className="font-normal cursor-pointer">{role}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>What tools are you skilled at using for creating music? (Select all that apply) <span className="text-destructive">*</span></Label>
                <div className="space-y-2">
                  {toolOptions.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tool-${tool}`} 
                        checked={formData.tools.includes(tool)}
                        onCheckedChange={(checked) => handleToolChange(tool, checked as boolean)}
                      />
                      <Label htmlFor={`tool-${tool}`} className="font-normal cursor-pointer">{tool}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>What is your level of experience in using your preferred tool? <span className="text-destructive">*</span></Label>
                <RadioGroup 
                  value={formData.experience} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                >
                  {experienceOptions.map((exp) => (
                    <div key={exp} className="flex items-center space-x-2">
                      <RadioGroupItem value={exp} id={`exp-${exp}`} />
                      <Label htmlFor={`exp-${exp}`} className="font-normal cursor-pointer">{exp}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>What areas do you think you need the most assistance in for your music career? (Select all that apply) <span className="text-destructive">*</span></Label>
                <div className="space-y-2">
                  {assistanceOptions.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`assist-${area}`} 
                        checked={formData.assistance.includes(area)}
                        onCheckedChange={(checked) => handleAssistanceChange(area, checked as boolean)}
                      />
                      <Label htmlFor={`assist-${area}`} className="font-normal cursor-pointer">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Examples */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Work Examples</h2>
              
              <div className="space-y-3">
                <Label htmlFor="audio">Submit audio file examples of your work (wav or mp3, up to 3 songs) <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input 
                    id="audio" 
                    type="file" 
                    accept=".wav,.mp3,audio/wav,audio/mpeg"
                    multiple
                    onChange={(e) => setAudioFiles(e.target.files)}
                    className="h-auto py-4 px-4 cursor-pointer file:mr-4 file:py-2 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                  />
                </div>
                {audioFiles && audioFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {audioFiles.length} file{audioFiles.length > 1 ? 's' : ''} selected
                  </div>
                )}
                <p className="text-sm text-muted-foreground">Maximum 3 files allowed</p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ApplicationFormPage;
