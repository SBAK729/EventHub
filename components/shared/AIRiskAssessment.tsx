"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Shield,
  Eye
} from "lucide-react"

interface ModerationData {
  risk_score?: number
  reasoning?: string
  flags?: string[]
}

interface AIRiskAssessmentProps {
  eventId: string
  eventTitle: string
  moderation?: ModerationData
  onApprove: () => void
  onReject: () => void
}

export default function AIRiskAssessment({ 
  eventId, 
  eventTitle, 
  moderation, 
  onApprove, 
  onReject 
}: AIRiskAssessmentProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine risk level based on score
  const getRiskLevel = (score?: number) => {
    if (!score) return { level: 'unknown', color: 'gray', icon: Info }
    if (score >= 0.8) return { level: 'high', color: 'red', icon: XCircle }
    if (score >= 0.5) return { level: 'medium', color: 'yellow', icon: AlertTriangle }
    return { level: 'low', color: 'green', icon: CheckCircle }
  }

  const riskInfo = getRiskLevel(moderation?.risk_score)
  const RiskIcon = riskInfo.icon

  return (
    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-[#11121a]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Risk Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">Automated content analysis</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Risk Score Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <RiskIcon className={`w-6 h-6 ${
              riskInfo.color === 'red' ? 'text-red-500' :
              riskInfo.color === 'yellow' ? 'text-yellow-500' :
              riskInfo.color === 'green' ? 'text-green-500' :
              'text-gray-500'
            }`} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Risk Level: {riskInfo.level.toUpperCase()}
              </p>
              {moderation?.risk_score && (
                <p className="text-sm text-muted-foreground">
                  Score: {(moderation.risk_score * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
          <Badge 
            variant={riskInfo.color === 'red' ? 'destructive' : 
                   riskInfo.color === 'yellow' ? 'secondary' : 
                   riskInfo.color === 'green' ? 'default' : 'outline'}
            className="text-xs"
          >
            {moderation?.risk_score ? `${(moderation.risk_score * 100).toFixed(0)}%` : 'N/A'}
          </Badge>
        </div>

        {/* Risk Flags */}
        {moderation?.flags && moderation.flags.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Issues:</p>
            <div className="flex flex-wrap gap-2">
              {moderation.flags.map((flag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* AI Reasoning */}
            {moderation?.reasoning && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Analysis:</p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {moderation.reasoning}
                  </p>
                </div>
              </div>
            )}

            {/* Event Details */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Details:</p>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Title:</strong> {eventTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Event ID:</strong> {eventId}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onApprove}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve Event
              </Button>
              <Button
                onClick={onReject}
                size="sm"
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject Event
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions (when collapsed) */}
        {!isExpanded && (
          <div className="flex gap-2">
            <Button
              onClick={onApprove}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              onClick={onReject}
              size="sm"
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button
              onClick={() => setIsExpanded(true)}
              size="sm"
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
