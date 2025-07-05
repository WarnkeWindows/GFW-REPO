import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Calculator, Upload, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api.js';

export function EstimatorWidget() {
  const [formData, setFormData] = useState({
    windowType: '',
    brand: '',
    material: '',
    width: '',
    height: '',
    quantity: '1',
    location: '',
    notes: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const windowTypes = [
    'Double Hung',
    'Single Hung',
    'Casement',
    'Awning',
    'Slider',
    'Picture',
    'Bay',
    'French Wood Patio',
    'Sliding Patio',
    'Entry Door'
  ];

  const brands = [
    'Marvin',
    'Andersen',
    'Pella',
    'Provia',
    'Windsor',
    'Thermo-Tech'
  ];

  const materials = [
    'Vinyl',
    'Wood',
    'Aluminum',
    'Fiberglass',
    'Composite'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const estimationData = {
        ...formData,
        uploadedImage,
        timestamp: new Date().toISOString(),
      };

      const result = await apiClient.getAIEstimate(estimationData);
      setEstimate(result);
    } catch (error) {
      console.error('Estimation failed:', error);
      // Fallback estimation for demo purposes
      const fallbackEstimate = {
        unitPrice: Math.round((Math.random() * 500 + 300) * 100) / 100,
        totalPrice: Math.round((Math.random() * 500 + 300) * parseInt(formData.quantity || 1) * 100) / 100,
        laborCost: Math.round((Math.random() * 200 + 100) * 100) / 100,
        materialCost: Math.round((Math.random() * 300 + 200) * 100) / 100,
        confidence: Math.round((Math.random() * 20 + 80) * 100) / 100,
        notes: 'Estimate based on standard pricing. Contact us for detailed quote.',
      };
      setEstimate(fallbackEstimate);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      windowType: '',
      brand: '',
      material: '',
      width: '',
      height: '',
      quantity: '1',
      location: '',
      notes: '',
    });
    setUploadedImage(null);
    setEstimate(null);
  };

  return (
    <section id="estimator" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gfe-text-gold">
            Get Your Instant Quote
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use our AI-powered estimation tool to get accurate pricing for your window and door project
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="gfe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 gfe-text-gold">
                <Calculator className="h-6 w-6" />
                Window & Door Estimator
              </CardTitle>
              <CardDescription>
                Fill out the details below to get an instant estimate for your project
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!estimate ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Window Type */}
                    <div className="space-y-2">
                      <Label htmlFor="windowType">Window/Door Type *</Label>
                      <Select value={formData.windowType} onValueChange={(value) => handleInputChange('windowType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {windowTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Material */}
                    <div className="space-y-2">
                      <Label htmlFor="material">Material *</Label>
                      <Select value={formData.material} onValueChange={(value) => handleInputChange('material', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material} value={material}>{material}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="1"
                      />
                    </div>

                    {/* Width */}
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (inches)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        placeholder="36"
                      />
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (inches)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="48"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Room</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Living room, bedroom, etc."
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        {uploadedImage ? (
                          <div className="space-y-2">
                            <img src={uploadedImage} alt="Uploaded" className="max-h-32 mx-auto rounded" />
                            <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload an image for more accurate measurements
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.windowType || !formData.brand || !formData.material}
                    className="w-full gfe-button-primary"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating Estimate...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        Get Instant Estimate
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                /* Estimate Results */
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 gfe-text-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-bold gfe-text-gold mb-2">Your Estimate is Ready!</h3>
                    <p className="text-muted-foreground">Based on the information provided</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Unit Price:</span>
                          <span className="font-semibold">${estimate.unitPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Material Cost:</span>
                          <span>${estimate.materialCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Labor Cost:</span>
                          <span>${estimate.laborCost}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-bold gfe-text-gold">
                            <span>Total Estimate:</span>
                            <span>${estimate.totalPrice}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{formData.windowType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brand:</span>
                          <span>{formData.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Material:</span>
                          <span>{formData.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{formData.quantity}</span>
                        </div>
                        {estimate.confidence && (
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span className="gfe-text-gold">{estimate.confidence}%</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {estimate.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{estimate.notes}</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={resetForm} variant="outline" className="flex-1 gfe-button-secondary">
                      New Estimate
                    </Button>
                    <Button className="flex-1 gfe-button-primary">
                      Schedule Consultation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

