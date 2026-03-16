import { useStudioStore } from '@/stores/studio-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function StepGeneralDetails() {
  const { title, year, category, description, errors, setField } =
    useStudioStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">General Details</h2>
        <p className="mt-1 text-sm text-white/40">
          Enter the basic information about your content
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="e.g. Introduction to React"
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Year</Label>
          <Input
            value={year}
            onChange={(e) => setField('year', e.target.value)}
            placeholder="2026"
          />
          {errors.year && <p className="text-xs text-red-400">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setField('category', v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="music">Music</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Describe what learners will gain from this content..."
          rows={4}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description}</p>
        )}
      </div>
    </div>
  )
}
